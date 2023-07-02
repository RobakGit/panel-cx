import prisma from "@/services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function Page(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { page } = req.query;
    if (!page || typeof page !== "string") {
      return res.status(badRequest).send({ responseMessage: "No page" });
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
    const { page } = req.query;
    const { displayName, messages } = req.body;
    if (!page || typeof page !== "string") {
      return res.status(badRequest).send({ responseMessage: "No page" });
    }

    const pageData = await prisma.page.findUnique({
      where: { uid: page },
    });
    if (pageData) {
      let newEntryFulfillment = pageData.entryFulfillment;
      if (newEntryFulfillment) {
        newEntryFulfillment.messages = messages;
      } else {
        newEntryFulfillment = { messages: messages };
      }

      return res.status(success).send(
        await prisma.page.update({
          where: { uid: page },
          data: { displayName, entryFulfillment: newEntryFulfillment },
        })
      );
    }
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
