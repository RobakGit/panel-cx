import { getActualAgent } from "@/localStorage/locatStorage";
import { Button, Grid, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

const FlowEditorContainer = (props: {
  flow: string | undefined;
  pagesOnFlow: Array<{
    displayName: string;
    uid: string;
    page: Array<{ displayName: string; uid: string }>;
  }>;
}) => {
  const { pagesOnFlow, flow } = props;
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    if (flow && flow !== "new") {
      fetch(`/api/flow/${flow}`)
        .then(data => data.json())
        .then(data => {
          setName(data.displayName);
        });
    }
  }, [flow, pagesOnFlow]);

  const changeName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setName(event.target.value);
  };

  const savePage = async () => {
    const agent = getActualAgent();
    await fetch(`/api/flow/${flow}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: name,
        agent,
        flow,
      }),
    })
      .then(data => data.json())
      .then(data => {
        router.query.flow = data.uid;
        router.push(router);
      });
  };

  const removePage = async () => {
    await fetch(`/api/flow/${flow}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(data => data.json())
      .then(() => {
        router.query.flow = "new";
        router.push(router);
      });
  };

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      p={4}
      spacing={4}
    >
      <Grid item container direction={"row"}>
        <Grid item xs={8}>
          <TextField
            required
            label="Nazwa Flow"
            fullWidth
            value={name}
            onChange={changeName}
          />
        </Grid>
        <Grid item container xs={4} direction={"row-reverse"}>
          <Grid>
            <Button variant="contained" sx={{ mx: 1 }} onClick={savePage}>
              Zapisz
            </Button>
            <Button variant="contained" sx={{ mx: 1 }} onClick={removePage}>
              Usuń
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FlowEditorContainer;
