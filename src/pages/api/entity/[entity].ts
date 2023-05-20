import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function Entity(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { entity } = req.query;
    if (!entity || typeof entity !== "string") {
      return res.status(badRequest).send({ responseMessage: "No entity" });
    }
    return res.status(success).send(
      await prisma.entity.findUnique({
        where: { uid: entity },
      })
    );
  } else if (req.method === "POST") {
    const { entity } = req.query;
    const {
      agent,
      displayName,
      entities,
    }: { agent: string; displayName: string; entities: Array<{}> } = req.body;
    if (!entity || entity == "undefined") {
      return res.status(success).send(
        await prisma.entity.create({
          data: {
            agentId: agent,
            displayName,
            entities,
          },
        })
      );
    } else {
      if (typeof entity === "string")
        return res.status(success).send(
          await prisma.entity.update({
            where: { uid: entity },
            data: {
              displayName,
              entities,
            },
          })
        );
    }
  } else if (req.method === "DELETE") {
    const { entity } = req.query;
    if (!entity || typeof entity !== "string")
      return res.status(badRequest).send("badRequest");
    return res
      .status(success)
      .send(await prisma.entity.delete({ where: { uid: entity } }));
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
