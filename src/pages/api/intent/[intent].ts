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
    const { intent } = req.query;
    if (!intent || typeof intent !== "string") {
      return res.status(badRequest).send({ responseMessage: "No intent" });
    }
    return res.status(success).send(
      await prisma.intent.findUnique({
        where: { uid: intent },
      })
    );
  } else if (req.method === "POST") {
    const { intent } = req.query;
    const {
      agent,
      displayName,
      trainingPhrases,
    }: { agent: string; displayName: string; trainingPhrases: Array<string> } =
      req.body;
    if (!intent || typeof intent !== "string") {
      return res.status(badRequest).send({ responseMessage: "No intent" });
    }
    if (intent === "new") {
      return res.status(success).send(
        await prisma.intent.create({
          data: {
            agentId: agent,
            displayName,
            trainingPhrases: trainingPhrases.map(phrase => {
              return {
                parts: phrase.split(/( )/g).map(part => {
                  return { text: part, auto: true };
                }),
                repeatCount: 1,
                languageCode: "pl",
              };
            }),
          },
        })
      );
    } else {
      return res.status(success).send(
        await prisma.intent.update({
          where: { uid: intent },
          data: {
            displayName,
            trainingPhrases: trainingPhrases.map(phrase => {
              return {
                parts: phrase.split(/( )/g).map(part => {
                  return { text: part, auto: true };
                }),
                repeatCount: 1,
                languageCode: "pl",
              };
            }),
          },
        })
      );
    }
  } else if (req.method === "DELETE") {
    const { intent } = req.query;
    if (!intent || typeof intent !== "string")
      return res.status(badRequest).send("badRequest");
    return res
      .status(success)
      .send(await prisma.intent.delete({ where: { uid: intent } }));
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
