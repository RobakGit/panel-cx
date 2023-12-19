import TestFilesList from "@/components/test/testFilesList";
import { getActualAgent } from "@/localStorage/locatStorage";
import { Button, Grid } from "@mui/material";
import { AutomaticTest } from "@prisma/client";
import { ChangeEvent, useEffect, useState } from "react";

export default function Test() {
  const [attachment, setAttachment] = useState<File | null>(null);
  const [originalTests, setOriginalTests] = useState<Array<AutomaticTest>>([]);
  const [testResults, setTestResults] = useState<Array<AutomaticTest>>([]);

  useEffect(() => {
    const agent = getActualAgent();
    if (!agent) return;
    fetch("/api/test", {
      method: "GET",
      headers: { agent: agent },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const results = data.filter((test: AutomaticTest) => test.results[0]);
        const original = data.filter((test: AutomaticTest) => test.data[0]);
        setOriginalTests([...original]);
        setTestResults([...results]);
      });
  }, []);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const [file] = files;
    setAttachment(file);
  };

  const sendTest = () => {
    const agent = getActualAgent();
    if (!attachment || !agent) return;
    const data = new FormData();
    data.append("agent", agent);
    data.append("testFile", attachment);
    fetch("/api/test", {
      method: "POST",
      body: data,
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data && data.automaticTest)
          setOriginalTests([data.automaticTest, ...originalTests]);
      });
  };

  const removeTest = (uid: string, type: string) => {
    fetch(`/api/test/delete/${uid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    }).then(response => {
      if (response.ok) {
        if (type === "original") {
          setOriginalTests([
            ...originalTests.filter((test: AutomaticTest) => test.uid !== uid),
          ]);
        } else {
          setTestResults([
            ...testResults.filter((test: AutomaticTest) => test.uid !== uid),
          ]);
        }
      }
    });
  };

  return (
    <Grid container direction={"column"} p={4} spacing={1}>
      <Grid item container spacing={1} direction={"row-reverse"}>
        <Grid item xs={4} sm={3} md={2}>
          <Button variant="contained" onClick={sendTest}>
            Wyślij test
          </Button>
        </Grid>
        <Grid
          item
          xs={5}
          md={3}
          lg={2}
          p={1}
          border={"1px solid grey"}
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <Button
            variant={attachment ? "contained" : "outlined"}
            component="label"
          >
            Upload File <input type="file" hidden onChange={handleFile} />
          </Button>
          {attachment?.name ?? "Nie wybrano pliku"}
        </Grid>
      </Grid>
      <TestFilesList
        tests={testResults}
        type={"result"}
        removeTest={removeTest}
      />
      <TestFilesList
        tests={originalTests}
        type={"original"}
        removeTest={removeTest}
      />
    </Grid>
  );
}
