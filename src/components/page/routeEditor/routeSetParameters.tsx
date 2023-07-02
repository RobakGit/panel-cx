import { Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const RouteSetParameters = (props: {
  setParameterActions?: Array<{ value: string; parameter: string }>;
}) => {
  const { setParameterActions } = props;

  return (
    <Grid item container>
      {setParameterActions &&
        setParameterActions.map(param => (
          <Grid item key={param.parameter} container direction={"row"}>
            <Grid xs={6}>
              <TextField label="Nazwa" value={param.parameter} />
            </Grid>
            <Grid xs={6}>
              <TextField label="Wartość" value={param.value} />
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
};

export default RouteSetParameters;
