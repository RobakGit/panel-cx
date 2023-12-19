import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";

const success = 200;
const notFound = 404;
const badRequest = 400;

export default async function DeleteTest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { type } = req.body;
    const { test: uid } = req.query;
    let responseData;

    if (typeof uid !== "string" || typeof type !== "string")
      return res.status(badRequest).send("Bad Request");

    const automaticTest = await prisma.automaticTest.findUnique({
      where: { uid },
    });

    const updateData = {
      result: { results: [] },
      original: { data: [] },
    };

    if (
      automaticTest &&
      ((type === "original" && automaticTest.results[0]) ||
        (type === "result" && automaticTest.data[0]))
    ) {
      responseData = await prisma.automaticTest.update({
        where: { uid },
        data: updateData[type],
      });
    } else {
      responseData = await prisma.automaticTest.delete({ where: { uid } });
    }
    return res.status(success).json(responseData);
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
