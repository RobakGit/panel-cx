import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";

const RouteIntent = (props: {
  intents: Array<{ displayName: string; uid: string }>;
  actualIntent: string | undefined;
}) => {
  const { intents, actualIntent } = props;
  const [routeIntent, setRouteIntent] = useState(actualIntent);

  return (
    <Grid item xs={12}>
      <FormControl fullWidth margin="dense">
        <InputLabel id={"intentSelectorLabel"}>Intencja</InputLabel>
        <Select label="intentSelectorLabel" value={routeIntent}>
          <MenuItem disabled value="">
            Wybierz intencję
          </MenuItem>
          {intents.map(intent => (
            <MenuItem key={intent.displayName} value={intent.displayName}>
              {intent.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

export default RouteIntent;
