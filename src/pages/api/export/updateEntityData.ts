import { Agent, kind } from "@prisma/client";
import fs from "fs";
import prisma from "@/services/prisma";
import { JsonValue } from "@prisma/client/runtime/library";

function findDirectory(path: string, entityUid: string) {
  const entities = fs.readdirSync(path);

  const entityDirectory = entities.filter(
    entity =>
      JSON.parse(fs.readFileSync(`${path}/${entity}/${entity}.json`).toString())
        .name === entityUid
  );
  return entityDirectory[0];
}

function updateEntitySynonyms(
  path: string,
  entityDir: string,
  language: string,
  entities: JsonValue[]
) {
  if (fs.existsSync(`${path}/${entityDir}/entities`)) {
    let entitiesData = JSON.parse(
      fs
        .readFileSync(`${path}/${entityDir}/entities/${language}.json`)
        .toString()
    );
    entitiesData.entities = entities;
    fs.writeFileSync(
      `${path}/${entityDir}/entities/${language}.json`,
      JSON.stringify(entitiesData, null, 2)
    );
  }
}

function updateEntity(
  path: string,
  entityDir: string,
  displayName: string,
  kind: kind,
  enableFuzzyExtraction: boolean
) {
  let entityData = JSON.parse(
    fs.readFileSync(`${path}/${entityDir}/${entityDir}.json`).toString()
  );

  entityData.displayName = displayName;
  entityData.kind = kind;
  entityData.enableFuzzyExtraction = enableFuzzyExtraction;

  fs.writeFileSync(
    `${path}/${entityDir}/${entityDir}.json`,
    JSON.stringify(entityData, null, 2)
  );
}

export default async function updateEntityData(agent: Agent) {
  const path = `./src/botFiles/${agent.projectId}-${agent.agent}/entityTypes`;

  const entities = await prisma.entity.findMany({
    where: {
      agent,
    },
  });

  for (const entity of entities) {
    const entityDir = findDirectory(path, entity.name);
    updateEntity(
      path,
      entityDir,
      entity.displayName,
      entity.kind,
      entity.enableFuzzyExtraction
    );
    updateEntitySynonyms(
      path,
      entityDir,
      agent.defaultLanguage,
      entity.entities
    );
  }
}
