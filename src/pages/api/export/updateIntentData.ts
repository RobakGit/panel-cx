import { Agent } from "@prisma/client";
import fs from "fs";
import fsPromises from "fs/promises";
import prisma from "@/services/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import { rimraf } from "rimraf";

function findDirectory(path: string, intentUid: string) {
  const intents = fs.readdirSync(path);

  const intentDirectory = intents.filter(
    intent =>
      JSON.parse(fs.readFileSync(`${path}/${intent}/${intent}.json`).toString())
        .name === intentUid
  );
  return intentDirectory[0];
}

function updatePhrases(
  path: string,
  intentDir: string,
  language: string,
  trainingPhrases: JsonValue[]
) {
  if (fs.existsSync(`${path}/${intentDir}/trainingPhrases`)) {
    let trainingPhrasesData = JSON.parse(
      fs
        .readFileSync(`${path}/${intentDir}/trainingPhrases/${language}.json`)
        .toString()
    );
    trainingPhrasesData.trainingPhrases = trainingPhrases;
    fs.writeFileSync(
      `${path}/${intentDir}/trainingPhrases/${language}.json`,
      JSON.stringify(trainingPhrasesData, null, 2)
    );
  }
}

function updateIntent(
  path: string,
  intentDir: string,
  displayName: string,
  numTrainingPhrases: number
) {
  let intentData = JSON.parse(
    fs.readFileSync(`${path}/${intentDir}/${intentDir}.json`).toString()
  );

  intentData.displayName = displayName;
  intentData.numTrainingPhrases = numTrainingPhrases;

  fs.writeFileSync(
    `${path}/${intentDir}/${intentDir}.json`,
    JSON.stringify(intentData, null, 2)
  );
}

export default async function updateIntentData(agent: Agent) {
  const path = `./src/botFiles/${agent.projectId}-${agent.agent}/intents`;

  const intents = await prisma.intent.findMany({
    where: {
      agent,
    },
  });
  const existingIntentsList: string[] = [];

  for (const intent of intents) {
    const intentDir = findDirectory(path, intent.name);
    if (intentDir) {
      existingIntentsList.push(intentDir);
      updateIntent(
        path,
        intentDir,
        intent.displayName,
        intent.trainingPhrases.length
      );
      updatePhrases(
        path,
        intentDir,
        agent.defaultLanguage,
        intent.trainingPhrases
      );
    } else {
      const encodedIntentName = encodeURI(intent.displayName);
      existingIntentsList.push(encodedIntentName);
      const newIntentDir = `${path}/${encodedIntentName}`;
      await fsPromises.mkdir(newIntentDir);
      await fsPromises.mkdir(`${newIntentDir}/trainingPhrases`);
      await fsPromises.writeFile(
        `${newIntentDir}/${encodedIntentName}.json`,
        JSON.stringify({ name: intent.name, priority: 500000 }, null, 2)
      );
      updateIntent(
        path,
        encodedIntentName,
        intent.displayName,
        intent.trainingPhrases.length
      );
      await fsPromises.writeFile(
        `${newIntentDir}/trainingPhrases/${agent.defaultLanguage}.json`,
        JSON.stringify({ trainingPhrases: [] }, null, 2)
      );
      updatePhrases(
        path,
        encodedIntentName,
        agent.defaultLanguage,
        intent.trainingPhrases
      );
    }
  }
  const intentsToRemove = (await fsPromises.readdir(path)).filter(
    dir => !existingIntentsList.includes(dir)
  );
  for (const intentToRemove of intentsToRemove) {
    await rimraf(`${path}/${intentToRemove}`);
  }
}
