import { getActualAgent } from "@/localStorage/locatStorage";
import { Box, Button, Chip, Grid, Paper, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import ResponseEditorContainer from "./responseEditor/responseEditorContainer";
import RouteEditorContainer from "./routeEditor/routeEditorContainer";

const PageEditorContainer = (props: {
  page: string | undefined;
  pagesOnFlow: Array<{
    displayName: string;
    uid: string;
    page: Array<{ displayName: string; uid: string }>;
  }>;
}) => {
  const { page, pagesOnFlow } = props;
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [transitionRoutes, setTransitionRoutes] = useState<
    Array<{
      name: string;
      intent?: string;
      targetPage?: string;
      triggerFulfillment: {
        messages?: Array<{
          text?: { text: string };
          payload?: {
            richContent?: Array<
              Array<
                | {
                    type: "chips";
                    options: Array<{ text?: string }>;
                  }
                | {
                    type: "image";
                    rawUrl: string;
                    accessibilityText: string;
                  }
              >
            >;
          };
        }>;
      };
    }>
  >([]);
  const [intents, setIntents] = useState<
    Array<{ displayName: string; uid: string }>
  >([]);
  const [actualFlow, setActualFlow] = useState<{
    displayName: string;
    uid: string;
    page: Array<{ displayName: string; uid: string }>;
  } | null>();
  const [sourcePages, setSourcePages] = useState<
    Array<{ uid: string; displayName: string }>
  >([]);
  const [parameters, setParameters] = useState<
    | Array<{
        displayName: string;
        entityType: string;
        required: boolean;
        fillBehavior: {};
      }>
    | undefined
  >();

  useEffect(() => {
    if (page) {
      fetch(`/api/page/${page}`)
        .then(data => data.json())
        .then(data => {
          setName(data.displayName);
          setMessages(data.entryFulfillment.messages);
          setTransitionRoutes(data.transitionRoutes);
          setSourcePages(data.sourcePages);
          setParameters(data.form.parameters);
        });
    }
    setActualFlow(
      pagesOnFlow.find(flow => flow.page.find(p => p.uid === page))
    );
  }, [page, pagesOnFlow]);

  useEffect(() => {
    const agent = getActualAgent();
    fetch("/api/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent }),
    })
      .then(data => data.json())
      .then(data => setIntents(data));
  }, []);

  const changeName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setName(event.target.value);
  };

  const savePage = () => {
    const agent = getActualAgent();
    fetch(`/api/page/${page}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name, agent }),
    })
      .then(data => data.json())
      .then(data => {
        setName(data.displayName);
      });
  };

  const removePage = () => {
    fetch(`/api/page/${page}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(data => data.json())
      .then(data => {});
  };

  const saveTextMessage = (value: string, index: number) => {
    if (messages && messages[index]) {
      let tempMessages = messages;
      tempMessages[index].text.text[0] = value;
      setMessages(tempMessages);
    }
  };

  return (
    <Grid
      container
      direction={"column"}
      justifyContent={"center"}
      p={4}
      spacing={4}
    >
      <Grid item>
        {sourcePages.map(sourcePage => (
          <Chip
            sx={{ backgroundColor: "primary.contrastText", boxShadow: 1 }}
            key={`${sourcePage.uid}-chip`}
            label={sourcePage.displayName}
          />
        ))}
      </Grid>
      <Grid item container direction={"row"}>
        <Grid item xs={8}>
          <TextField
            required
            label="Nazwa Page'a"
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
      <Grid item container direction={"row"}>
        <Grid item container direction={"column"} xs={7}>
          Odpowiedź
          {messages &&
            messages.map((message, i) => (
              <ResponseEditorContainer
                key={i}
                message={message}
                index={i}
                saveMessage={saveTextMessage}
              />
            ))}
        </Grid>
        <Grid item xs={5}>
          Parametry
          <Paper sx={{ wordWrap: "break-word" }}>
            {JSON.stringify(parameters)}
          </Paper>
        </Grid>
      </Grid>
      <Grid item container>
        Ścieżki
        <Grid
          item
          container
          direction={"row"}
          overflow={"auto"}
          maxWidth={"80vw"}
          wrap="nowrap"
          gap={5}
        >
          {actualFlow &&
            transitionRoutes.map((route, i) => (
              <RouteEditorContainer
                key={`route-${i}`}
                route={route}
                intents={intents}
                pagesOnFlow={pagesOnFlow}
                actualFlow={actualFlow}
              />
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PageEditorContainer;
