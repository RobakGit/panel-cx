import { Agent, Flow } from "@prisma/client";
import fs from "fs";
import prisma from "@/services/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import fsPromises from "fs/promises";
import { rimraf } from "rimraf";

function findFile(path: string, flowName: string) {
  const flows = fs.readdirSync(`${path}`);
  const flowDirectory = flows.filter(
    flow =>
      flow ===
      encodeURI(flowName)
        .replaceAll("%20", " ")
        .replace(/%../g, match => match.toLowerCase())
  );
  return flowDirectory[0];
}

async function createFlowDirWithJson(path: string, flow: Flow) {
  const dirName = encodeURI(flow.displayName)
    .replaceAll("%20", " ")
    .replace(/%../g, match => match.toLowerCase());
  await fsPromises.mkdir(`${path}/${dirName}`);
  await fsPromises.writeFile(
    `${path}/${dirName}/${dirName}.json`,
    JSON.stringify({
      name: flow.uid,
      displayName: flow.displayName,
      nluSettings: flow.nluSettings,
    })
  );
  return dirName;
}

function makeSureFlowHasPageDir(path: string) {
  if (!fs.existsSync(`${path}/pages`)) {
    fs.mkdirSync(`${path}/pages`);
  }
}

function updateFlow(path: string, flowDir: string, displayName: string) {
  let flowData = JSON.parse(
    fs.readFileSync(`${path}/${flowDir}/${flowDir}.json`).toString()
  );

  flowData.displayName = displayName;

  fs.writeFileSync(
    `${path}/${flowDir}/${flowDir}.json`,
    JSON.stringify(flowData, null, 2)
  );
}

export default async function updateFlowData(agent: Agent) {
  const path = `./src/botFiles/${agent.projectId}-${agent.agent}/flows`;

  const flows = await prisma.flow.findMany({
    where: {
      agent,
    },
  });

  const existingFlowsList: string[] = [];
  for (const flow of flows) {
    let flowDir = findFile(path, flow.displayName);

    if (!flowDir) {
      flowDir = await createFlowDirWithJson(path, flow);
    }
    existingFlowsList.push(flowDir);
    makeSureFlowHasPageDir(`${path}/${flowDir}`);
    updateFlow(path, flowDir, flow.displayName);
  }

  const flowsToRemove = (await fsPromises.readdir(path)).filter(
    dir => !existingFlowsList.includes(dir)
  );

  for (const flowToRemove of flowsToRemove) {
    await rimraf(`${path}/${flowToRemove}`);
  }
}
