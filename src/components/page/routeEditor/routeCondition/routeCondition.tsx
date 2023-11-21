import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

const RouteCondition = (props: {
  condition: string | undefined;
  index: number;
  type: string;
  saveRouteCondition: (condition: string, type: string, index: number) => void;
}) => {
  const { condition, type, index, saveRouteCondition } = props;
  const [name, setName] = useState("");
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (condition) {
      const splittedCondition = condition.split(" ").filter(el => el);
      setName(splittedCondition[0] ?? "");
      setOperator(splittedCondition[1] ?? "=");
      setValue(splittedCondition[2] ?? "");
    }
  }, [condition]);

  const changeName = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newName = event.target.value;
    setName(newName);
  };

  const changeOperator = (event: SelectChangeEvent<string>) => {
    const newOperator = event.target.value;
    setOperator(newOperator);
  };

  const changeValue = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const saveCondition = () => {
    const condition = `${name} ${operator} ${value}`;
    saveRouteCondition(condition, type, index);
  };

  return (
    <Grid item container direction={"row"}>
      <Grid item xs={5}>
        <TextField
          fullWidth
          label="Nazwa"
          value={name}
          onChange={changeName}
          onBlur={saveCondition}
        />
      </Grid>
      <Grid item xs={2}>
        <FormControl fullWidth>
          <InputLabel id={"methodSelectorLabel"}>Metoda</InputLabel>
          <Select
            fullWidth
            label="methodSelectorLabel"
            value={operator}
            onChange={changeOperator}
            onBlur={saveCondition}
          >
            <MenuItem value="=">=</MenuItem>
            <MenuItem value="!=">!=</MenuItem>
            <MenuItem value="<">{"<"}</MenuItem>
            <MenuItem value="<=">{"<="}</MenuItem>
            <MenuItem value=">">{">"}</MenuItem>
            <MenuItem value=">=">{">="}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <TextField
          fullWidth
          label="Wartość"
          value={value}
          onChange={changeValue}
          onBlur={saveCondition}
        />
      </Grid>
    </Grid>
  );
};

export default RouteCondition;
