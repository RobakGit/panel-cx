import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function DialogflowImport(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { agent } = req.body;
    if (!agent) {
      return res.status(badRequest).send({ responseMessage: "No agent" });
    }
    return res.status(success).send(
      await prisma.intent.findMany({
        where: { agentId: agent },
        select: { uid: true, displayName: true },
        orderBy: { displayName: "asc" },
      })
    );
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
