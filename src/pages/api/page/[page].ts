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
    const { displayName, messages, transitionRoutes, parameters } = req.body;
    if (!page || typeof page !== "string") {
      return res.status(badRequest).send({ responseMessage: "No page" });
    }

    const pageData = await prisma.page.findUnique({
      where: { uid: page },
      select: { entryFulfillment: true, flow: true },
    });
    if (pageData) {
      let newEntryFulfillment = pageData.entryFulfillment;
      const agent = await prisma.agent.findFirst({
        where: { uid: pageData.flow.agentId },
      });
      let newMessages = messages?.map(message => {
        message.languageCode = agent?.defaultLanguage;
        return message;
      });
      if (newEntryFulfillment) {
        newEntryFulfillment.messages = newMessages;
      } else {
        newEntryFulfillment = { messages: newMessages };
      }

      let newTransitionRoutes = transitionRoutes;
      newTransitionRoutes = transitionRoutes.map(transitionRoute => {
        const transitionRoutesMessages =
          transitionRoute?.triggerFulfillment?.messages?.map(
            transitionRouteMessage => {
              transitionRouteMessage.languageCode = agent?.defaultLanguage;

              return transitionRouteMessage;
            }
          );
        if (transitionRoutesMessages && transitionRoutesMessages.length > 0) {
          transitionRoute.triggerFulfillment.messages =
            transitionRoutesMessages;
        }
        return transitionRoute;
      });

      let newParameters = parameters;
      newParameters = newParameters.map(parameter => {
        let newParameter =
          parameter.fillBehavior.initialPromptFulfillment.messages.map(
            message => {
              message.languageCode = agent?.defaultLanguage;

              return message;
            }
          );
        if (newParameter && newParameter.length > 0) {
          parameter.fillBehavior.initialPromptFulfillment.messages =
            newParameter;
        }
        return parameter;
      });

      return res.status(success).send(
        await prisma.page.update({
          where: { uid: page },
          data: {
            displayName,
            entryFulfillment: newEntryFulfillment,
            transitionRoutes: newTransitionRoutes,
            form: { parameters: newParameters },
          },
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
