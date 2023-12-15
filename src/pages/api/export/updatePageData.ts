import { Agent } from "@prisma/client";
import fs from "fs";
import prisma from "@/services/prisma";
import { JsonValue } from "@prisma/client/runtime/library";
import fsPromises from "fs/promises";
import { rimraf } from "rimraf";

function findFile(path: string, pageUid: string) {
  const pages = fs.readdirSync(`${path}/pages`);

  const pageDirectory = pages.filter(
    page =>
      JSON.parse(fs.readFileSync(`${path}/pages/${page}`).toString()).name ===
      pageUid
  );
  return pageDirectory[0];
}

function createPageFile(
  path: string,
  pageDisplayName: string,
  pageUid: string
) {
  const fileName = encodeURI(pageDisplayName);
  fs.writeFileSync(
    `${path}/pages/${fileName}.json`,
    JSON.stringify({ name: pageUid })
  );
  return `${fileName}.json`;
}

function updatePage(
  path: string,
  pageFile: string,
  displayName: string,
  form: JsonValue,
  entryFulfillment: JsonValue,
  transitionRoutes: JsonValue[]
) {
  let pageData = JSON.parse(
    fs.readFileSync(`${path}/pages/${pageFile}`).toString()
  );

  pageData.displayName = displayName;
  pageData.form = form;
  if (!Array.isArray(entryFulfillment)) {
    pageData.entryFulfillment = entryFulfillment;
  }
  pageData.transitionRoutes = transitionRoutes;

  fs.writeFileSync(
    `${path}/pages/${pageFile}`,
    JSON.stringify(pageData, null, 2)
  );
}

export default async function updatePageData(agent: Agent) {
  const path = `./src/botFiles/${agent.projectId}-${agent.agent}/flows`;

  const flows = await prisma.flow.findMany({
    where: {
      agent,
    },
    select: {
      uid: true,
    },
  });
  const flowsUidArr = flows.map(flow => flow.uid);
  const pages = await prisma.page.findMany({
    where: {
      flowId: { in: flowsUidArr },
    },
    select: {
      name: true,
      displayName: true,
      entryFulfillment: true,
      transitionRoutes: true,
      form: true,
      flow: true,
    },
  });

  const existingPagesList: string[] = [];
  for (const page of pages) {
    let pageFile = findFile(`${path}/${page.flow.displayName}`, page.name);
    if (!pageFile) {
      pageFile = createPageFile(
        `${path}/${page.flow.displayName}`,
        page.displayName,
        page.name
      );
    }
    existingPagesList.push(pageFile);
    updatePage(
      `${path}/${page.flow.displayName}`,
      pageFile,
      page.displayName,
      page.form,
      page.entryFulfillment,
      page.transitionRoutes
    );
  }

  const flowsList = Array.from(
    new Set(pages.map(page => page.flow.displayName))
  );

  let pagesToRemove: Array<{ flowName: string; pageName: string }> = [];

  for (const flow of flowsList) {
    pagesToRemove = (await fsPromises.readdir(`${path}/${flow}/pages`))
      .filter(dir => !existingPagesList.includes(dir))
      .map(el => {
        return { flowName: flow, pageName: el };
      });
  }

  for (const pageToRemove of pagesToRemove) {
    await rimraf(
      `${path}/${pageToRemove.flowName}/pages/${pageToRemove.pageName}`
    );
  }
}
