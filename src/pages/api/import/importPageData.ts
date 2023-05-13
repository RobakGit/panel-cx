import prisma from "../services/prisma";
import fs from "fs";
import { Agent, Flow, Page } from "@prisma/client";

export default async function importPages9iData({
  flowsList,
  agent,
}: {
  flowsList: Array<Flow>;
  agent: Agent;
}) {
  let importedPages: { [key: string]: Array<Page> } = {};
  for (const flow of flowsList) {
    if (
      !fs.existsSync(
        `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/flows/${flow.displayName}/pages`
      )
    )
      continue;
    const pagesList = fs.readdirSync(
      `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/flows/${flow.displayName}/pages`
    );

    for (const page of pagesList) {
      const pageData = JSON.parse(
        fs
          .readFileSync(
            `./src/pages/api/botFiles/${agent.projectId}-${agent.agent}/flows/${flow.displayName}/pages/${page}`
          )
          .toString()
      );

      const existedPage = await prisma.page.findUnique({
        where: { name_flowId: { name: pageData.name, flowId: flow.uid } },
      });

      let operatedPage: Page;
      if (existedPage) {
        operatedPage = await prisma.page.update({
          where: { name_flowId: { name: pageData.name, flowId: flow.uid } },
          data: {
            displayName: pageData.displayName,
            entryFulfillment: pageData.entryFulfillment ?? [],
            transitionRoutes: pageData.transitionRoutes ?? [],
          },
        });
      } else {
        operatedPage = await prisma.page.create({
          data: {
            name: pageData.name,
            displayName: pageData.displayName,
            flowId: flow.uid,
            entryFulfillment: pageData.entryFulfillment ?? [],
            transitionRoutes: pageData.transitionRoutes ?? [],
          },
        });
      }

      if (importedPages[flow.displayName]) {
        importedPages[flow.displayName].push(operatedPage);
      } else {
        importedPages[flow.displayName] = [operatedPage];
      }
    }
  }
  return importedPages;
}
