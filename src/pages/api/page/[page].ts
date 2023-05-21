import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function Page(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { page } = req.query;
    if (!page || typeof page !== "string") {
      return res.status(badRequest).send({ responseMessage: "No entity" });
    }
    const pageData = await prisma.page.findUnique({
      where: { uid: page },
    });
    let sourcePages = await prisma.page.findMany({
      where: { flowId: pageData?.flowId },
      select: { uid: true, displayName: true, transitionRoutes: true },
    });
    sourcePages = sourcePages.filter(source =>
      source.transitionRoutes.find(
        route => route["targetPage"] === pageData?.displayName
      )
    );
    return res.status(success).send({ ...pageData, sourcePages });
  } else if (req.method === "POST") {
  } else if (req.method === "DELETE") {
    const { page } = req.query;
    if (!page || typeof page !== "string")
      return res.status(badRequest).send("badRequest");
    return res
      .status(success)
      .send(await prisma.page.delete({ where: { uid: page } }));
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
