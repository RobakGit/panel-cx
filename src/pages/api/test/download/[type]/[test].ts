import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/services/prisma";
import xlsx from "xlsx";

const success = 200;
const notFound = 404;
const badRequest = 400;

interface dataMap {
  [key: string]: "results" | "data";
}

export default async function DownloadTest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { test: uid, type } = req.query;
    const dataMap: dataMap = {
      result: "results",
      original: "data",
    };
    if (typeof uid !== "string" || typeof type !== "string")
      return res.status(badRequest).send("Bad Request");

    const automaticTest = await prisma.automaticTest.findUnique({
      where: { uid },
    });
    if (!automaticTest) return res.status(notFound).send("Not Found");

    const data = automaticTest[dataMap[type]];
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, "test");
    const file = xlsx.write(workbook, { type: "buffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${encodeURI(
        (type === "result" ? "Results " : "") + automaticTest.filename
      )}`
    );
    res.status(success).send(file);
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
