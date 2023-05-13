import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { AgentsClient } from "@google-cloud/dialogflow-cx";
import StreamZip from "node-stream-zip";
import prisma from "@/services/prisma";
import importAgentData from "./importAgentData";
import importFlowsData from "./importFlowData";
import importIntentsData from "./importIntentData";
import importWebhookData from "./importWebhookData";
import importEntitiesData from "./importEntityData";
import importPagesData from "./importPageData";

const bot = "test-cx-337210-1964942375bb.json";
const keyPath = `./src/keys/${bot}`;
const key = JSON.parse(fs.readFileSync(keyPath).toString());
const copiedNameFromDialogflow =
  "projects/test-cx-337210/locations/europe-west1/agents/dcceffad-08bd-4afc-84e8-ec36b3c6b72c";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function DialogflowImport(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { agentName, agentDisplayName } = req.body;
    if (!agentName || typeof agentName !== "string") {
      return res
        .status(badRequest)
        .send({ responseMessage: "Incorrect agent name" });
    }

    const [projectId, locations, agent] = agentName
      .split(/projects\/|\/locations\/|\/agents\//)
      .filter(el => el);

    const agentClient = new AgentsClient({
      apiEndpoint: `${locations}-dialogflow.googleapis.com`,
      projectId: key.project_id,
      keyFilename: keyPath,
    });

    const [operation] = await agentClient.exportAgent({
      name: copiedNameFromDialogflow,
      dataFormat: "JSON_PACKAGE",
    });
    const [response] = await operation.promise();
    if (!fs.existsSync(`./src/botFiles/${projectId}-${agent}`)) {
      fs.mkdirSync(`./src/botFiles/${projectId}-${agent}`);
    }
    if (response && response.agentContent) {
      fs.writeFileSync(
        `./src/botFiles/${projectId}-${agent}/${agent}.zip`,
        response.agentContent
      );
    }

    const zip = new StreamZip.async({
      file: `./src/botFiles/${projectId}-${agent}/${agent}.zip`,
    });
    const count = await zip.extract(
      null,
      `./src/botFiles/${projectId}-${agent}`
    );
    console.log(`Extracted ${count} entries`);
    await zip.close();

    const importedAgent = await importAgentData({
      agent,
      projectId,
      locations,
      displayName: agentDisplayName,
    });
    if (importedAgent) {
      const importedFlows = await importFlowsData(importedAgent);
      console.log(importedFlows);

      const importedEntities = await importEntitiesData(importedAgent);
      console.log(importedEntities);

      const importedIntents = await importIntentsData(importedAgent);
      console.log(importedIntents);

      const importedWebhooks = await importWebhookData(importedAgent);
      console.log(importedWebhooks);

      const importedPages = await importPagesData({
        agent: importedAgent,
        flowsList: importedFlows,
      });
      console.log(importedPages);
    }

    return res
      .status(success)
      .send({ responseMessage: "Import succeeded", importedAgent });
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
