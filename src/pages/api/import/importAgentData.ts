import prisma from "@/services/prisma";
import fs from "fs";

export default async function importAgentData({
  agent,
  projectId,
  locations,
  displayName,
}: {
  agent: string;
  projectId: string;
  locations: string;
  displayName: string;
}) {
  const agentData = JSON.parse(
    fs
      .readFileSync(`./src/botFiles/${projectId}-${agent}/agent.json`)
      .toString()
  );

  const existedAgent = await prisma.agent.findUnique({
    where: { projectId_agent: { projectId, agent } },
  });
  if (existedAgent) {
    return await prisma.agent.update({
      where: { projectId_agent: { projectId, agent } },
      data: {
        displayName: displayName,
        location: locations,
        startFlow: agentData.startFlow,
      },
    });
  } else {
    return await prisma.agent.create({
      data: {
        agent: agent,
        displayName,
        projectId: projectId,
        location: locations,
        startFlow: agentData.startFlow,
      },
    });
  }
}
