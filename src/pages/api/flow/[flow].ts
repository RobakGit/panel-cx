import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function Intent(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { flow } = req.query;
    if (!flow || typeof flow !== "string") {
      return res.status(badRequest).send({ responseMessage: "No flow" });
    }
    const flowData = await prisma.flow.findUnique({
      where: { uid: flow },
    });
    return res.status(success).send(flowData);
  } else if (req.method === "POST") {
    const { flow } = req.query;
    const { agent, displayName }: { agent: string; displayName: string } =
      req.body;
    if (!flow || typeof flow !== "string") {
      return res.status(badRequest).send({ responseMessage: "No flow" });
    }
    if (flow === "new") {
      return res.status(success).send(
        await prisma.flow.create({
          data: {
            agentId: agent,
            displayName,
            nluSettings: {
              modelType: "MODEL_TYPE_STANDARD",
              classificationThreshold: 0.30000001,
            },
          },
        })
      );
    } else {
      return res.status(success).send(
        await prisma.flow.update({
          where: { uid: flow },
          data: { displayName },
        })
      );
    }
  } else if (req.method === "DELETE") {
    const { flow } = req.query;
    if (!flow || typeof flow !== "string")
      return res.status(badRequest).send("badRequest");
    await prisma.page.deleteMany({ where: { flowId: flow } });
    return res
      .status(success)
      .send(await prisma.flow.delete({ where: { uid: flow } }));
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
