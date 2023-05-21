import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const RouteCondition = (props: { condition: string | undefined }) => {
  const { condition } = props;
  const [name, setName] = useState("");
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    if (condition) {
      const splittedCondition = condition.split(" ");
      setName(splittedCondition[0]);
      const tempOperator = splittedCondition[1];
      setOperator(tempOperator);
      setValue(condition.split(tempOperator)[1]);
    }
  }, [condition]);

  return (
    <Grid item container direction={"row"}>
      <Grid item xs={5}>
        <TextField fullWidth label="Nazwa" value={name} />
      </Grid>
      <Grid item xs={2}>
        <FormControl fullWidth>
          <InputLabel id={"methodSelectorLabel"}>Metoda</InputLabel>
          <Select fullWidth label="methodSelectorLabel" value={operator}>
            <MenuItem value="=">=</MenuItem>
            <MenuItem value="!=">!=</MenuItem>
            <MenuItem value="<">{"<"}</MenuItem>
            <MenuItem value="<=">{"<="}</MenuItem>
            <MenuItem value=">">{">"}</MenuItem>
            <MenuItem value="=>">{"=>"}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <TextField fullWidth label="Wartość" value={value} />
      </Grid>
    </Grid>
  );
};

export default RouteCondition;
