import {
  FormControl,
  FormControlLabel,
  Grid,
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
import RouteCondition from "./routeCondition";
import RouteTarget from "./routeTarget";
import RouteSetParameters from "./routeSetParameters";

const RouteEditorContainer = (props: {
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
}) => {
  const { route, intents, pagesOnFlow, actualFlow } = props;

  return (
    <Grid item xs={5}>
      <Paper sx={{ m: 1, p: 2, display: "flex", flexDirection: "column" }}>
        <Grid container spacing={2} xs={12} width={"100vw"}>
          <RouteIntent intents={intents} actualIntent={route.intent} />
          {route.condition &&
            route.condition
              .split(/AND|OR/g)
              .map(condition => (
                <RouteCondition key={condition} condition={condition.trim()} />
              ))}
          <RouteTarget
            targetPage={route.targetPage}
            targetFlow={route.targetFlow}
            actualFlow={actualFlow}
            pagesOnFlow={pagesOnFlow}
          />
          <RouteSetParameters
            setParameterActions={route.triggerFulfillment.setParameterActions}
          />
          <Grid item container>
            {route.triggerFulfillment.messages &&
              route.triggerFulfillment.messages.map((message, i) => (
                <ResponseEditorContainer key={i} message={message} index={i} />
              ))}
          </Grid>
          {JSON.stringify(route)}
        </Grid>
      </Paper>
    </Grid>
  );
};

export default RouteEditorContainer;
