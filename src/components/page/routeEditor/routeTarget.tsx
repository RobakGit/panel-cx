import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const RouteTarget = (props: {
  targetPage?: string;
  targetFlow?: string;
  actualFlow: {
    displayName: string;
    uid: string;
    page: Array<{ displayName: string; uid: string }>;
  };
  pagesOnFlow: Array<{
    displayName: string;
    uid: string;
    page: Array<{ displayName: string; uid: string }>;
  }>;
}) => {
  const { targetPage, targetFlow, actualFlow, pagesOnFlow } = props;
  const [targetType, setTargetType] = useState(targetFlow ? "flow" : "page");

  return (
    <Grid item container>
      <Grid item>
        <RadioGroup
          row
          value={targetType}
          onChange={e => setTargetType(e.target.value)}
        >
          <FormControlLabel value="page" control={<Radio />} label="Page" />
          <FormControlLabel value="flow" control={<Radio />} label="Flow" />
        </RadioGroup>
      </Grid>
      <Grid item xs={12}>
        {targetType === "flow" ? (
          <FormControl fullWidth>
            <InputLabel id={"targetSelectorLabel"}>Flow</InputLabel>
            <Select label="targetSelectorLabel" value={targetFlow}>
              <MenuItem disabled value="">
                Wybierz flow
              </MenuItem>
              {pagesOnFlow.map(flow => (
                <MenuItem key={flow.displayName} value={flow.displayName}>
                  {flow.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <FormControl fullWidth>
            <InputLabel id={"targetSelectorLabel"}>Page</InputLabel>
            <Select label="targetSelectorLabel" value={targetPage}>
              <MenuItem disabled value="">
                Wybierz page
              </MenuItem>
              {actualFlow.page.map(page => (
                <MenuItem key={page.displayName} value={page.displayName}>
                  {page.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>
    </Grid>
  );
};

export default RouteTarget;
