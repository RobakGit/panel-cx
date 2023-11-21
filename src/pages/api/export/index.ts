import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { AgentsClient } from "@google-cloud/dialogflow-cx";
import StreamZip from "node-stream-zip";
import prisma from "@/services/prisma";
import formidable from "formidable";
import createExportZipFile from "./createExportZipFile";
import updateIntentData from "./updateIntentData";
import updateEntityData from "./updateEntityData";
import updatePageData from "./updatePageData";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function DialogflowExport(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { agent } = req.body;
    const agentData = await prisma.agent.findUnique({ where: { uid: agent } });
    if (!agentData?.keyFilePath || !agentData?.location) {
      return res.status(500).send({ responseMessage: "Server Error" });
    }
    const key = JSON.parse(fs.readFileSync(agentData.keyFilePath).toString());

    const agentClient = new AgentsClient({
      apiEndpoint: `${agentData.location}-dialogflow.googleapis.com`,
      projectId: key.project_id,
      keyFilename: agentData.keyFilePath,
    });

    //TODO update agent files
    await updateIntentData(agentData);
    await updateEntityData(agentData);
    await updatePageData(agentData);
    // console.log(updatedIntents);
    //TODO update agent files

    const agentZip = await createExportZipFile(
      `./src/botFiles/${agentData.projectId}-${agentData.agent}`
    );
    const agentZipData = fs.readFileSync(agentZip);
    let agentUint8Array = new Uint8Array(agentZipData);

    agentClient
      .restoreAgent({
        name: `projects/${agentData.projectId}/locations/${agentData.location}/agents/${agentData.agent}`,
        agentContent: agentUint8Array,
      })
      .then(res => {
        console.log(res);
      });
    return res.status(success).send({ responseMessage: "export succeeded" });
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
