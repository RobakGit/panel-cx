import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import RouteCondition from "./routeCondition";

const RouteConditionContainer = (props: {
  routeCondition: string | undefined;
  addCondition: (type: string) => void;
  saveRouteCondition: (condition: string, type: string, index: number) => void;
  changeConditionType: (type: string) => void;
}) => {
  const {
    routeCondition,
    addCondition,
    saveRouteCondition,
    changeConditionType,
  } = props;
  const [conditions, setConditions] = useState(
    routeCondition ? routeCondition.split(/ AND | OR /g) : [""]
  );
  const [type, setType] = useState("OR");

  useEffect(() => {
    if (routeCondition) {
      const and = routeCondition.match(" AND ");
      const or = routeCondition.match(" OR ");
      let type;
      if (!and) {
        type = "OR";
      } else if (!or) {
        type = "AND";
      } else {
        type = "custom";
      }

      setType(type);
    }
  }, [routeCondition]);

  const changeType = (e: ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value;
    setType(newType);
    changeConditionType(newType);
  };

  return (
    <>
      <Grid item container direction={"row"}>
        <RadioGroup
          row
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
          value={type}
          onChange={changeType}
        >
          <FormControlLabel value="OR" control={<Radio />} label="OR" />
          <FormControlLabel value="AND" control={<Radio />} label="AND" />
          <FormControlLabel value="custom" control={<Radio />} label="custom" />
        </RadioGroup>
      </Grid>
      {type !== "custom" ? (
        <>
          {conditions.map((condition, i) => (
            <RouteCondition
              key={`${condition}-${i}`}
              index={i}
              condition={condition.trim()}
              type={type}
              saveRouteCondition={saveRouteCondition}
            />
          ))}
          <Button variant="text" onClick={() => addCondition(type)}>
            Dodaj warunek ({type})
          </Button>
        </>
      ) : (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Wartość"
            value={routeCondition}
            // onChange={changeValue}
            // onBlur={saveCondition}
          />
        </Grid>
      )}
    </>
  );
};

export default RouteConditionContainer;
