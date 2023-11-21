import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import fsPromises from "fs/promises";
import { AgentsClient } from "@google-cloud/dialogflow-cx";
import StreamZip from "node-stream-zip";
import prisma from "@/services/prisma";
import importAgentData from "./importAgentData";
import importFlowsData from "./importFlowData";
import importIntentsData from "./importIntentData";
import importWebhookData from "./importWebhookData";
import importEntitiesData from "./importEntityData";
import importPagesData from "./importPageData";
import formidable from "formidable";

const success = 200;
const notFound = 404;
const badRequest = 400;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function DialogflowImport(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = formidable({ multiples: true });
    new Promise(
      (
        resolve: (value: {
          keyFile: string;
          agentName: string;
          agentDisplayName: string;
        }) => void,
        reject: (reason: string) => void
      ) => {
        form.parse(req, async (err, _fields, files) => {
          if (_fields.agentUid && typeof _fields.agentUid === "string") {
            const agent = await prisma.agent.findUnique({
              where: { uid: _fields.agentUid },
              select: {
                keyFilePath: true,
                agent: true,
                displayName: true,
                location: true,
              },
            });
            if (agent) {
              return resolve({
                keyFile: agent.keyFilePath,
                agentName: `projects/${agent.displayName}/locations/${agent.location}/agents/${agent.agent}`,
                agentDisplayName: agent.displayName,
              });
            }
          }
          if (!_fields.agentName || !files.key)
            return reject("!_fields.agentName || files.key");
          if (
            Array.isArray(files.key) ||
            typeof _fields.agentName !== "string" ||
            typeof _fields.agentDisplayName !== "string"
          )
            return reject("param types error");
          const key: formidable.File = files.key;
          if (!key.filepath) return reject("!key.filepath");
          const keyFile = `./src/keys/${key.originalFilename}`;
          await fsPromises.copyFile(key.filepath, keyFile);
          return resolve({
            keyFile,
            agentName: _fields.agentName,
            agentDisplayName: _fields.agentDisplayName,
          });
        });
      }
    )
      .then(async ({ keyFile, agentName, agentDisplayName }) => {
        const key = JSON.parse(fs.readFileSync(keyFile).toString());
        if (!agentName || typeof agentName !== "string") {
          return res
            .status(badRequest)
            .send({ responseMessage: "Incorrect agent name" });
        }

        const [projectId, locations, agent] = agentName
          .split(/projects\/|\/locations\/|\/agents\//)
          .filter(el => el);

        console.log(key.project_id);
        const agentClient = new AgentsClient({
          apiEndpoint: `${locations}-dialogflow.googleapis.com`,
          projectId: key.project_id,
          keyFilename: keyFile,
        });

        const [operation] = await agentClient.exportAgent({
          name: agentName,
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
          keyFile,
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
      })
      .catch(err => console.log(err));
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
