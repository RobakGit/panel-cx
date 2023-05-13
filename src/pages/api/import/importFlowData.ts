import prisma from "../services/prisma";
import fs from "fs";
import { Agent, Flow } from "@prisma/client";

export default async function importFlowsData(agent: Agent) {
  const flowsList = fs.readdirSync(
    `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/flows`
  );
  const importedFlows: Array<Flow> = [];

  for (const flow of flowsList) {
    const flowData = JSON.parse(
      fs
        .readFileSync(
          `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/flows/${flow}/${flow}.json`
        )
        .toString()
    );

    const existedFlow = await prisma.flow.findUnique({
      where: { name_agentId: { name: flowData.name, agentId: agent.uid } },
    });

    let operatedFlow: Flow;
    if (existedFlow) {
      operatedFlow = await prisma.flow.update({
        where: { name_agentId: { name: flowData.name, agentId: agent.uid } },
        data: {
          displayName: flowData.displayName,
          nluSettings: flowData.nluSettings,
        },
      });
    } else {
      operatedFlow = await prisma.flow.create({
        data: {
          name: flowData.name,
          displayName: flowData.displayName,
          agentId: agent.uid,
          nluSettings: flowData.nluSettings,
        },
      });
    }

    importedFlows.push(operatedFlow);
  }
  return importedFlows;
}
