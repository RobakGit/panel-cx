import { NextApiRequest, NextApiResponse } from "next";
import fsPromises from "fs/promises";
import prisma from "@/services/prisma";
import formidable from "formidable";
import xlsx from "xlsx";
import executeTest from "./executeTest";

const success = 200;
const notFound = 404;
const badRequest = 400;

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface IRequiredFields {
  alias: string;
  question: string;
  correctPage: string;
}

export function isValidData(
  testData: unknown[]
): testData is IRequiredFields[] {
  return (
    (testData as IRequiredFields[]).filter(
      data => data.alias && data.question && data.correctPage
    ).length === testData.length
  );
}

export default async function DialogflowTest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { agent } = req.headers;
    if (typeof agent !== "string") {
      return res.status(badRequest).send("Request need agent id");
    }
    return res.status(success).send(
      await prisma.automaticTest.findMany({
        where: { agentId: agent },
        orderBy: { createdAt: "desc" },
      })
    );
  } else if (req.method === "POST") {
    const form = formidable({ multiples: true });
    new Promise(
      (
        resolve: (value: {
          testData: unknown[];
          filename: string;
          agent: string;
        }) => void,
        reject: (reason: string) => void
      ) => {
        form.parse(req, async (err, _fields, files) => {
          if (!_fields.agent || !files.testFile)
            return reject("!_fields.agentName || files.testFile");
          if (
            Array.isArray(files.testFile) ||
            typeof _fields.agent !== "string"
          )
            return reject("param types error");
          const testFile: formidable.File = files.testFile;
          const fileData = await fsPromises.readFile(testFile.filepath);
          const workbook = xlsx.read(fileData);
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const testData = xlsx.utils.sheet_to_json(worksheet);

          return resolve({
            testData,
            filename:
              testFile.originalFilename ??
              `test-${new Date().toISOString()}.xlsx`,
            agent: _fields.agent,
          });
        });
      }
    )
      .then(async ({ testData, filename, agent }) => {
        if (!isValidData(testData))
          return res.status(badRequest).send({ responseMessage: "error" });

        const automaticTest = await prisma.automaticTest.create({
          data: {
            agentId: agent,
            filename,
            data: testData as [],
            casesCount: testData.length,
          },
        });

        executeTest(automaticTest);

        return res
          .status(success)
          .send({ responseMessage: "test send succeeded", automaticTest });
      })
      .catch(err => console.log(err));
  } else {
    return res.status(notFound).send({ responseMessage: "No route" });
  }
}
