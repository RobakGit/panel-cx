import { getActualAgent } from "@/localStorage/locatStorage";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import ResponseEditorContainer from "./responseEditor/responseEditorContainer";
import RouteEditorContainer from "./routeEditor/routeEditorContainer";
import DraggableResponse from "./responseEditor/draggableResponse";
import { useRouter } from "next/router";
import NewResponseBlock from "./responseEditor/newResponseBlock";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { v4 as uuidv4 } from "uuid";
import ParameterContainer from "./parameterEditor/parameterContainer";

const PageEditorContainer = (props: {
  page: string | undefined;
  flow: string | undefined;
  pagesOnFlow: Array<{
    displayName: string;
    uid: string;
    page: Array<{ displayName: string; uid: string }>;
  }>;
}) => {
  const { page, pagesOnFlow, flow } = props;
  const router = useRouter();
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
    if (page && page !== "new") {
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

  const savePage = async () => {
    const agent = getActualAgent();
    await fetch(`/api/page/${page}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: name,
        agent,
        messages,
        transitionRoutes,
        parameters,
        flow,
      }),
    })
      .then(data => data.json())
      .then(data => {
        delete router.query.flow;
        router.query.page = data.uid;
        router.push(router);
      });
  };

  const removePage = async () => {
    await fetch(`/api/page/${page}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(data => data.json())
      .then(data => {
        router.query.flow = data.flowId;
        router.query.page = "new";
        router.push(router);
      });
  };

  const saveMessage = (
    value: string | { type: string; rawUrl: string; accessibilityText: string },
    index: number,
    type: string
  ) => {
    if (messages && messages[index]) {
      let tempMessages = messages;
      if (type === "text") {
        tempMessages[index].text.text[0] = value;
        return setMessages(tempMessages);
      }
      if (type === "button") {
        tempMessages[index].payload.richContent[0][0].options = value;
      }
      if (type === "image" && typeof value === "object") {
        tempMessages[index].payload.richContent[0][0] = value;
      }
      setMessages([...tempMessages]);
    }
  };

  const saveParameters = (
    parameters: Array<{
      displayName: string;
      entityType: string;
      required: boolean;
      fillBehavior: {};
    }>,
    isReloadRequired: boolean
  ) => {
    if (isReloadRequired) {
      setParameters([...parameters]);
    } else {
      setParameters(parameters);
    }
  };

  const routeToPage = (uid: string) => {
    router.query["page"] = uid;
    router.push(router);
  };

  const addResponseBlock = (newBlock: any) => {
    if (messages) {
      setMessages([...messages, newBlock]);
    } else {
      setMessages([newBlock]);
    }
  };

  const removeResponseBlock = (index: number) => {
    let newMessages = messages;
    newMessages.splice(index, 1);
    setMessages([...newMessages]);
  };

  const addTransitionRoute = (newBlock: any) => {
    if (transitionRoutes) {
      setTransitionRoutes([newBlock, ...transitionRoutes]);
    } else {
      setTransitionRoutes([newBlock]);
    }
  };

  const saveTransitionRoute = (value: {}, index: number) => {
    let tempTransitionRoutes = transitionRoutes;
    if (tempTransitionRoutes && tempTransitionRoutes[index]) {
      tempTransitionRoutes[index] = value;
      setTransitionRoutes([...tempTransitionRoutes]);
    }
  };

  const removeTransitionRoute = (index: number) => {
    let newTransitionRoutes = transitionRoutes;
    newTransitionRoutes.splice(index, 1);
    setTransitionRoutes([...newTransitionRoutes]);
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
            onClick={() => routeToPage(sourcePage.uid)}
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
      <Grid item container spacing={2} direction={"row"}>
        <Grid item container direction={"column"} xs={7}>
          Odpowiedź
          {messages &&
            messages.map((message, i) => (
              <div key={uuidv4()} style={{ position: "relative" }}>
                <IconButton
                  sx={{ position: "absolute", right: 0 }}
                  onClick={() => removeResponseBlock(i)}
                >
                  <CancelIcon />
                </IconButton>
                <ResponseEditorContainer
                  message={message}
                  index={i}
                  saveMessage={saveMessage}
                />
              </div>
            ))}
          <NewResponseBlock addResponseBlock={addResponseBlock} />
        </Grid>
        <ParameterContainer
          parameters={parameters}
          saveParameters={saveParameters}
        />
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
          <Grid item xs={3}>
            <Paper
              sx={{ m: 1, p: 2, display: "flex", flexDirection: "column" }}
            >
              <Grid
                container
                item
                spacing={2}
                xs={12}
                width={"100vw"}
                minHeight={"10rem"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <IconButton
                  aria-label="add"
                  size="large"
                  onClick={() =>
                    addTransitionRoute({
                      name: "",
                      triggerFulfillment: { messages: [] },
                    })
                  }
                >
                  <AddCircleIcon color="primary" fontSize="large" />
                </IconButton>
              </Grid>
            </Paper>
          </Grid>
          {actualFlow &&
            transitionRoutes.map((route, i) => (
              <RouteEditorContainer
                key={`route-${i}-${JSON.stringify(route)}`}
                transitionIndex={i}
                route={route}
                intents={intents}
                pagesOnFlow={pagesOnFlow}
                actualFlow={actualFlow}
                routeToPage={routeToPage}
                saveTransitionRoute={saveTransitionRoute}
                removeTransitionRoute={removeTransitionRoute}
              />
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PageEditorContainer;
