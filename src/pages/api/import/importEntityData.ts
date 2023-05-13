import prisma from "../services/prisma";
import fs from "fs";
import { Agent, Entity, autoExpansionMode } from "@prisma/client";

export default async function importEntitiesData(agent: Agent) {
  const entitiesList = fs.readdirSync(
    `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/entityTypes`
  );
  const importedEntities: Array<Entity> = [];

  for (const entity of entitiesList) {
    const entityData = JSON.parse(
      fs
        .readFileSync(
          `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/entityTypes/${entity}/${entity}.json`
        )
        .toString()
    );

    let entities = [];
    if (
      fs.existsSync(
        `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/entityTypes/${entity}/entities`
      )
    ) {
      entities = JSON.parse(
        fs
          .readFileSync(
            `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/entityTypes/${entity}/entities/pl.json`
          )
          .toString()
      );
    }

    const existedEntity = await prisma.entity.findUnique({
      where: { name_agentId: { name: entityData.name, agentId: agent.uid } },
    });

    let operatedEntity: Entity;
    if (existedEntity) {
      operatedEntity = await prisma.entity.update({
        where: { name_agentId: { name: entityData.name, agentId: agent.uid } },
        data: {
          displayName: entityData.displayName,
          kind: entityData.kind,
          autoExpansionMode:
            entityData.autoExpansionMode ??
            autoExpansionMode.AUTO_EXPANSION_MODE_UNSPECIFIED,
          enableFuzzyExtraction: entityData.enableFuzzyExtraction ?? false,
          entities,
        },
      });
    } else {
      operatedEntity = await prisma.entity.create({
        data: {
          name: entityData.name,
          displayName: entityData.displayName,
          agentId: agent.uid,
          kind: entityData.kind,
          autoExpansionMode:
            entityData.autoExpansionMode ??
            autoExpansionMode.AUTO_EXPANSION_MODE_UNSPECIFIED,
          enableFuzzyExtraction: entityData.enableFuzzyExtraction ?? false,
          entities,
        },
      });
    }

    importedEntities.push(operatedEntity);
  }
  return importedEntities;
}
