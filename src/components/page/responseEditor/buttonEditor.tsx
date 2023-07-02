import { Chip, Grid, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const ButtonEditor = (props: {
  text?: string;
  index: number;
  editButton: (option: { text: string }, optionIndex: number) => void;
  removeButton: (index: number) => void;
}) => {
  const { text, index, editButton, removeButton } = props;
  const [value, setValue] = useState(text);
  const [edit, setEdit] = useState(false);

  const handleClick = () => {
    setEdit(true);
  };

  const handleBlur = () => {
    if (value) {
      editButton({ text: value }, index);
    }
    setEdit(false);
  };

  return (
    <Grid item>
      <Chip
        sx={{
          position: "relative",
          paddingRight: "2rem",
          "& .MuiChip-deleteIcon": { position: "absolute", right: 0 },
        }}
        onDelete={() => removeButton(index)}
        label={
          edit ? (
            <TextField
              variant="standard"
              value={value}
              onChange={e => setValue(e.target.value)}
              autoFocus
              onBlur={handleBlur}
            />
          ) : (
            value
          )
        }
        onClick={handleClick}
      />
    </Grid>
  );
};

export default ButtonEditor;
