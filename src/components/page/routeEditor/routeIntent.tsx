import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

const RouteIntent = (props: {
  intents: Array<{ displayName: string; uid: string }>;
  actualIntent: string | undefined;
  saveRouteIntent: (intent: string) => void;
}) => {
  const { intents, actualIntent, saveRouteIntent } = props;
  const [routeIntent, setRouteIntent] = useState(actualIntent ?? "");

  const changeIntent = (changeEvent: SelectChangeEvent) => {
    const intent = changeEvent.target.value;
    setRouteIntent(intent);
    saveRouteIntent(intent);
  };

  return (
    <Grid item xs={12}>
      <FormControl fullWidth margin="dense">
        <InputLabel id={"intentSelectorLabel"}>Intencja</InputLabel>
        <Select
          label="intentSelectorLabel"
          value={routeIntent}
          onChange={changeIntent}
        >
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
