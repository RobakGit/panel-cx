import prisma from "@/services/prisma";
import fs from "fs";
import { Agent } from "@prisma/client";

export default async function importWebhookData(agent: Agent) {
  const webhooksList = fs.readdirSync(
    `./src/botFiles/${agent.projectId}-${agent.agent}/webhooks`
  );
  const importedWebhooks = [];

  for (const webhook of webhooksList) {
    const webhookData = JSON.parse(
      fs
        .readFileSync(
          `./src/botFiles/${agent.projectId}-${agent.agent}/webhooks/${webhook}`
        )
        .toString()
    );

    const existedWebhook = await prisma.webhook.findUnique({
      where: {
        name_agentId: { name: webhookData.name, agentId: agent.uid },
      },
    });
    if (existedWebhook) {
      importedWebhooks.push(
        await prisma.webhook.update({
          where: {
            name_agentId: { name: webhookData.name, agentId: agent.uid },
          },
          data: {
            displayName: webhookData.displayName,
            disabled: webhookData.disabled ?? false,
            genericWebService: webhookData.genericWebService,
            timeout: webhookData.timeout,
          },
        })
      );
    } else {
      importedWebhooks.push(
        await prisma.webhook.create({
          data: {
            name: webhookData.name,
            displayName: webhookData.displayName,
            agentId: agent.uid,
            disabled: webhookData.disabled ?? false,
            genericWebService: webhookData.genericWebService,
            timeout: webhookData.timeout,
          },
        })
      );
    }
  }
  return importedWebhooks;
}
