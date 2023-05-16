import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const success = 200;
const notFound = 404;

export default async function DialogflowImport(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return res.status(success).send(await prisma.agent.findMany());
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
