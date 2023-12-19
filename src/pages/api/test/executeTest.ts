import prisma from "@/services/prisma";
import { AutomaticTest } from "@prisma/client";
import { IRequiredFields, isValidData } from ".";
import { SessionsClient } from "@google-cloud/dialogflow-cx";
import { v4 as uuidv4 } from "uuid";
import { google } from "@google-cloud/dialogflow-cx/build/protos/protos";

export default async function executeTest(automaticTest: AutomaticTest) {
  const testCases = automaticTest.data;
  const agent = await prisma.agent.findUnique({
    where: { uid: automaticTest.agentId },
  });
  if (!isValidData(testCases) || !agent?.projectId || !agent.keyFilePath)
    return;

  const client = new SessionsClient({
    apiEndpoint: `${agent.location}-dialogflow.googleapis.com`,
    projectId: agent.projectId,
    keyFilename: agent.keyFilePath,
  });

  let results = [];
  let correctCasesCount = 0;
  for await (const testCase of testCases as IRequiredFields[]) {
    const sessionPath = client.projectLocationAgentEnvironmentSessionPath(
      agent.projectId,
      agent.location,
      agent.agent,
      "draft",
      uuidv4()
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: testCase.question,
        },
        languageCode: agent.defaultLanguage,
      },
    };
    const responses = await client.detectIntent(request);
    const result = responses[0].queryResult;

    const lastStep = result?.diagnosticInfo
      ? google.protobuf.Struct.create(result.diagnosticInfo)
          .toJSON()
          .fields["Execution Sequence"].listValue.values.pop().structValue
          .fields
      : undefined;

    const currentPage = result?.currentPage?.displayName;
    const isCorrect = currentPage === testCase.correctPage;
    if (isCorrect) correctCasesCount++;

    results.push({
      ...testCase,
      detectedIntent: result?.intent?.displayName,
      matchType: result?.match?.matchType,
      matchConfidence: result?.match?.confidence,
      detectedParameters: JSON.stringify(result?.match?.parameters?.fields),
      currentPage,
      currentFlow: Object.values(
        lastStep[Object.keys(lastStep)[0]]?.structValue?.fields?.StateMachine
          ?.structValue?.fields?.FlowState?.structValue?.fields?.Name
      )[0],
      isCorrect,
    });
  }

  await prisma.automaticTest.update({
    where: { uid: automaticTest.uid },
    data: { results: results as [], correctCases: correctCasesCount },
  });
}
