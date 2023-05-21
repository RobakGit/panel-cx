import prisma from "@/services/prisma";
import fs from "fs";
import { Agent, Intent } from "@prisma/client";

export default async function importIntentsData(agent: Agent) {
  const intentsList = fs.readdirSync(
    `./src/botFiles/${agent.projectId}-${agent.agent}/intents`
  );
  const importedIntents: Array<Intent> = [];

  for (const intent of intentsList) {
    const intentData = JSON.parse(
      fs
        .readFileSync(
          `./src/botFiles/${agent.projectId}-${agent.agent}/intents/${intent}/${intent}.json`
        )
        .toString()
    );

    let trainingPhrases = [];
    if (
      fs.existsSync(
        `./src/botFiles/${agent.projectId}-${agent.agent}/intents/${intent}/trainingPhrases`
      )
    ) {
      trainingPhrases = JSON.parse(
        fs
          .readFileSync(
            `./src/botFiles/${agent.projectId}-${agent.agent}/intents/${intent}/trainingPhrases/${agent.defaultLanguage}.json`
          )
          .toString()
      ).trainingPhrases;
    }

    const existedIntent = await prisma.intent.findUnique({
      where: { name_agentId: { name: intentData.name, agentId: agent.uid } },
    });

    let operatedIntent: Intent;
    if (existedIntent) {
      operatedIntent = await prisma.intent.update({
        where: { name_agentId: { name: intentData.name, agentId: agent.uid } },
        data: {
          displayName: intentData.displayName,
          parameters: intentData.parameters ?? [],
          priority: intentData.priority,
          trainingPhrases,
          description: intentData.description ?? "",
          isFallback: intentData.isFallback ?? false,
        },
      });
    } else {
      operatedIntent = await prisma.intent.create({
        data: {
          name: intentData.name,
          displayName: intentData.displayName,
          agentId: agent.uid,
          parameters: intentData.parameters ?? [],
          priority: intentData.priority,
          trainingPhrases: trainingPhrases,
          description: intentData.description ?? "",
          isFallback: intentData.isFallback ?? false,
        },
      });
    }

    importedIntents.push(operatedIntent);
  }
  return importedIntents;
}
