import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function Entities(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { agent, searchValue } = req.body;
    if (!agent) {
      return res.status(badRequest).send({ responseMessage: "No agent" });
    }
    let entities = await prisma.entity.findMany({
      where: { agentId: agent },
      // select: { uid: true, displayName: true },
      orderBy: { displayName: "asc" },
    });
    if (searchValue) {
      entities = entities.filter(
        entityType =>
          entityType.entities.filter(
            entity =>
              entity?.synonyms.filter(synonym =>
                synonym.toLowerCase().match(searchValue.toLowerCase())
              ).length
          ).length
      );
    }
    return res.status(success).send(entities);
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
