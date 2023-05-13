import prisma from "../services/prisma";
import fs from "fs";

export default async function importAgentData({
  agent,
  projectId,
  locations,
}: {
  agent: string;
  projectId: string;
  locations: string;
}) {
  const agentData = JSON.parse(
    fs
      .readFileSync(`./src/pages/api/botFiles/${projectId}-${agent}/agent.json`)
      .toString()
  );

  const existedAgent = await prisma.agent.findUnique({
    where: { projectId_agent: { projectId, agent } },
  });
  if (existedAgent) return existedAgent;

  return await prisma.agent.create({
    data: {
      agent: agent,
      displayName: "",
      projectId: projectId,
      location: locations,
      startFlow: agentData.startFlow,
    },
  });
}
