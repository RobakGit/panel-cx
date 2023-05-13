import { MouseEventHandler } from "react";
import { Button, SxProps, Theme } from "@mui/material";

const InvertedMuiButton = (props: {
  sx?: SxProps<Theme>;
  text?: string;
  size?: "small" | "medium" | "large";
  onClick?: MouseEventHandler | undefined;
}) => {
  const { sx, text, size, onClick } = props;

  const style = {
    ...sx,
    color: "primary.main",
    backgroundColor: "background.default",
    ":hover": { backgroundColor: "primary.contrastText" },
  };
  return (
    <Button sx={style} variant="contained" size={size} onClick={onClick}>
      {text}
    </Button>
  );
};

export default InvertedMuiButton;
