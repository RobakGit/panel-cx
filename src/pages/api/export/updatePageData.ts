import { Agent } from "@prisma/client";
import fs from "fs";
import prisma from "@/services/prisma";
import { JsonValue } from "@prisma/client/runtime/library";

function findFile(path: string, pageUid: string) {
  const pages = fs.readdirSync(`${path}/pages`);

  const pageDirectory = pages.filter(
    page =>
      JSON.parse(fs.readFileSync(`${path}/pages/${page}`).toString()).name ===
      pageUid
  );
  return pageDirectory[0];
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

  for (const page of pages) {
    const pageFile = findFile(`${path}/${page.flow.displayName}`, page.name);
    updatePage(
      `${path}/${page.flow.displayName}`,
      pageFile,
      page.displayName,
      page.form,
      page.entryFulfillment,
      page.transitionRoutes
    );
  }
}
