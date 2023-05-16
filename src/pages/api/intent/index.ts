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
    const { agent, searchValue } = req.body;
    if (!agent) {
      return res.status(badRequest).send({ responseMessage: "No agent" });
    }
    let intents = await prisma.intent.findMany({
      where: { agentId: agent },
      // select: { uid: true, displayName: true },
      orderBy: { displayName: "asc" },
    });
    if (searchValue) {
      intents = intents.filter(
        intent =>
          intent.trainingPhrases.filter(phrase =>
            phrase.parts
              .map(part => part.text)
              .join("")
              .toLowerCase()
              .match(searchValue.toLowerCase())
          ).length
      );
    }
    return res.status(success).send(intents);
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
