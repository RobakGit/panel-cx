import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import ResponseEditorContainer from "../responseEditor/responseEditorContainer";
import RouteIntent from "./routeIntent";
import RouteCondition from "./routeCondition/routeCondition";
import RouteTarget from "./routeTarget";
import RouteSetParameters from "./routeSetParameters";
import NewResponseBlock from "../responseEditor/newResponseBlock";
import CancelIcon from "@mui/icons-material/Cancel";
import { v4 as uuidv4 } from "uuid";
import RouteConditionContainer from "./routeCondition/routeConditionContainer";

const RouteEditorContainer = (props: {
  transitionIndex: number;
  route: {
    name: string;
    intent?: string;
    targetPage?: string;
    targetFlow?: string;
    condition?: string;
    triggerFulfillment: {
      setParameterActions?: Array<{ value: string; parameter: string }>;
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
  };
  intents: Array<{ displayName: string; uid: string }>;
  pagesOnFlow: Array<{
    displayName: string;
    uid: string;
    page: Array<{ displayName: string; uid: string }>;
  }>;
  actualFlow: {
    displayName: string;
    uid: string;
    page: Array<{ displayName: string; uid: string }>;
  };
  routeToPage: (uid: string) => void;
  saveTransitionRoute: (value: {}, index: number) => void;
  removeTransitionRoute: (index: number) => void;
}) => {
  const {
    transitionIndex,
    route,
    intents,
    pagesOnFlow,
    actualFlow,
    routeToPage,
    saveTransitionRoute,
    removeTransitionRoute,
  } = props;

  const saveRouteIntent = (intent: string) => {
    route.intent = intent;
    saveTransitionRoute(route, transitionIndex);
  };

  const addCondition = (type: string) => {
    if (route.condition) {
      route.condition += ` ${type} `;
    } else {
      route.condition = ` ${type} `;
    }
    console.log(route.condition.split(/ AND | OR /g));
    saveTransitionRoute(route, transitionIndex);
  };

  const saveRouteCondition = (
    condition: string,
    type: string,
    index: number
  ) => {
    const tempConditions = route.condition?.split(` ${type} `) ?? [];
    tempConditions[index] = condition;
    route.condition = tempConditions.join(` ${type} `);
    saveTransitionRoute(route, transitionIndex);
  };

  const changeConditionType = (type: string) => {
    if (type !== "custom") {
      route.condition = route.condition?.replaceAll(/ AND | OR /g, ` ${type} `);
      saveTransitionRoute(route, transitionIndex);
    }
  };

  const saveRouteTarget = (target: string, type: string) => {
    if (type === "flow") {
      route.targetFlow = target;
      delete route.targetPage;
    } else {
      route.targetPage = target;
      delete route.targetFlow;
    }
    saveTransitionRoute(route, transitionIndex);
  };

  const addResponseBlock = (newBlock: any) => {
    if (route.triggerFulfillment.messages) {
      route.triggerFulfillment.messages.push(newBlock);
    } else {
      route.triggerFulfillment.messages = [newBlock];
    }
    saveTransitionRoute(route, transitionIndex);
  };

  const removeResponseBlock = (index: number) => {
    route.triggerFulfillment.messages.splice(index, 1);
    saveTransitionRoute(route, transitionIndex);
  };

  const saveTransitionMessage = (
    value: string | { type: string; rawUrl: string; accessibilityText: string },
    index: number,
    type: string
  ) => {
    if (
      route.triggerFulfillment.messages &&
      route.triggerFulfillment.messages[index]
    ) {
      let tempMessages = route.triggerFulfillment.messages;
      if (type === "text") {
        tempMessages[index].text.text[0] = value;
      }
      if (type === "button") {
        tempMessages[index].payload.richContent[0][0].options = value;
      }
      if (type === "image" && typeof value === "object") {
        tempMessages[index].payload.richContent[0][0] = value;
      }

      route.triggerFulfillment.messages = tempMessages;
      saveTransitionRoute(route, transitionIndex);
    }
  };

  return (
    <Grid item xs={5}>
      <Paper sx={{ m: 1, p: 2, display: "flex", flexDirection: "column" }}>
        <div key={uuidv4()} style={{ position: "relative" }}>
          <IconButton
            sx={{ position: "absolute", right: -25, top: -25 }}
            onClick={() => removeTransitionRoute(transitionIndex)}
          >
            <CancelIcon />
          </IconButton>
          <Grid container item spacing={2} xs={12} width={"100vw"}>
            <RouteIntent
              intents={intents}
              actualIntent={route.intent}
              saveRouteIntent={saveRouteIntent}
            />
            <RouteConditionContainer
              routeCondition={route.condition}
              addCondition={addCondition}
              saveRouteCondition={saveRouteCondition}
              changeConditionType={changeConditionType}
            />
            <RouteTarget
              targetPage={route.targetPage}
              targetFlow={route.targetFlow}
              actualFlow={actualFlow}
              pagesOnFlow={pagesOnFlow}
              routeToPage={routeToPage}
              saveRouteTarget={saveRouteTarget}
            />
            <RouteSetParameters
              setParameterActions={route.triggerFulfillment.setParameterActions}
            />
            <Grid item container>
              {route.triggerFulfillment.messages &&
                route.triggerFulfillment.messages.map((message, i) => (
                  <div
                    key={uuidv4()}
                    style={{ position: "relative", width: "100%" }}
                  >
                    <IconButton
                      sx={{ position: "absolute", right: 0 }}
                      onClick={() => removeResponseBlock(i)}
                    >
                      <CancelIcon />
                    </IconButton>
                    <ResponseEditorContainer
                      key={i}
                      message={message}
                      index={i}
                      saveMessage={saveTransitionMessage}
                    />
                  </div>
                ))}
              <NewResponseBlock addResponseBlock={addResponseBlock} />
            </Grid>
          </Grid>
        </div>
      </Paper>
    </Grid>
  );
};

export default RouteEditorContainer;
