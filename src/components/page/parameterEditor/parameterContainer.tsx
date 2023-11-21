import { Grid, Paper } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { getActualAgent } from "@/localStorage/locatStorage";
import ParameterEditor from "./parameterEditor";

const ParameterContainer = (props: {
  parameters:
    | Array<{
        displayName: string;
        entityType: string;
        required: boolean;
        fillBehavior: {};
      }>
    | undefined;
  saveParameters: (
    parameters: Array<{
      displayName: string;
      entityType: string;
      required: boolean;
      fillBehavior: {};
    }>,
    isReloadRequired: boolean
  ) => void;
}) => {
  const { parameters, saveParameters } = props;
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const agent = getActualAgent();
    fetch("/api/entity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent }),
    })
      .then(data => data.json())
      .then(data => {
        setEntities(data);
        console.log(data);
      });
  }, []);

  const saveParameterForm = (
    parameter: {
      displayName: string;
      entityType: string;
      required: boolean;
      fillBehavior: {};
    },
    index: number,
    isReloadRequired: boolean
  ) => {
    let newParameters = parameters;
    if (newParameters && newParameters[index]) {
      newParameters[index] = parameter;
      saveParameters(newParameters, isReloadRequired);
    }
  };

  return (
    <Grid item xs={5}>
      Parametry
      {parameters?.map((parameter, i) => (
        <ParameterEditor
          key={uuidv4()}
          parameterIndex={i}
          parameter={parameter}
          entities={entities}
          saveParameterForm={saveParameterForm}
        />
      ))}
      <Paper sx={{ wordWrap: "break-word" }}>
        {JSON.stringify(parameters)}
      </Paper>
    </Grid>
  );
};

export default ParameterContainer;
