import { DeleteForever } from "@mui/icons-material";
import { Button, Grid, IconButton } from "@mui/material";
import { AutomaticTest } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export default function TestFilesList({
  tests,
  type,
  removeTest,
}: {
  tests: Array<AutomaticTest>;
  type: string;
  removeTest: (uid: string, type: string) => void;
}) {
  return (
    <Grid item container gap={1} direction={"column"}>
      {type === "result" ? "Wyniki" : "Pliki oryginalne"}
      {tests.map(test => (
        <Grid
          item
          container
          key={uuidv4()}
          p={0.1}
          border={1}
          borderRadius={3}
          bgcolor={"#fff"}
          alignItems={"center"}
        >
          <Grid item xs={2}>
            <Button
              variant="text"
              href={`/api/test/download/${type}/${test.uid}`}
            >
              Pobierz
            </Button>
          </Grid>
          <Grid item xs={4}>
            {test.filename}
          </Grid>
          <Grid item xs={1}>
            {type === "result" &&
              test.correctCases &&
              test.correctCases + "/" + test.casesCount}
          </Grid>
          <Grid item xs={1}>
            {type === "result" &&
              test.correctCases &&
              (test.correctCases / test.casesCount) * 100 + "%"}
          </Grid>
          <Grid item xs={3}>
            {new Date(test.createdAt).toISOString()}
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => removeTest(test.uid, type)}>
              <DeleteForever />
            </IconButton>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
