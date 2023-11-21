import { Chip, Grid, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";

const NewResponseBlock = (props: {
  addResponseBlock: (value: any) => void;
}) => {
  const { addResponseBlock } = props;
  const [active, setActive] = useState(false);

  const handleActive = () => {
    setActive(!active);
  };

  const selectBlockType = (type: string) => {
    console.log(type);
    let newBlock;
    if (type === "button") {
      newBlock = {
        payload: {
          richContent: [[{ type: "chips", options: [{ text: "" }] }]],
        },
      };
    }
    if (type === "text") {
      newBlock = { text: { text: [""] } };
    }
    if (type === "image") {
      newBlock = {
        payload: {
          richContent: [[{ type: "image", rawUrl: "", accessibilityText: "" }]],
        },
      };
    }

    if (newBlock) {
      addResponseBlock(newBlock);
    }

    setActive(false);
  };

  return (
    <Grid
      item
      display={"flex"}
      flexDirection={"column"}
      bgcolor={"primary.contrastText"}
      m={1}
      borderRadius={2}
      boxShadow={1}
      alignItems={"center"}
      sx={active ? { maxHeight: 1000 } : { maxHeight: 100 }}
      style={{ transition: "all 0.3s linear", width: "100%" }}
    >
      {active ? (
        <Grid item container position={"relative"}>
          <IconButton
            sx={{ position: "absolute", right: 0 }}
            aria-label="close"
            size="large"
            onClick={handleActive}
          >
            <CloseIcon color="primary" fontSize="inherit" />
          </IconButton>
          <Grid item container direction={"row"} justifyContent={"center"}>
            <Grid
              sx={{
                "&:hover": { backgroundColor: "background.default" },
                cursor: "pointer",
              }}
              item
              borderRight={1}
              borderLeft={1}
              onClick={() => selectBlockType("button")}
            >
              <Grid>
                <MenuOutlinedIcon
                  sx={{ stroke: "#ffffff", strokeWidth: 1, fontSize: "8rem" }}
                />
              </Grid>
              <Grid textAlign="center">Przyciski</Grid>
            </Grid>
            <Grid
              sx={{
                "&:hover": { backgroundColor: "background.default" },
                cursor: "pointer",
              }}
              item
              borderRight={1}
              borderLeft={1}
              onClick={() => selectBlockType("text")}
            >
              <Grid>
                <ChatOutlinedIcon
                  sx={{ stroke: "#ffffff", strokeWidth: 1, fontSize: "8rem" }}
                />
              </Grid>
              <Grid textAlign="center">Tekst</Grid>
            </Grid>
            <Grid
              sx={{
                "&:hover": { backgroundColor: "background.default" },
                cursor: "pointer",
              }}
              item
              borderRight={1}
              borderLeft={1}
              onClick={() => selectBlockType("image")}
            >
              <Grid>
                <InsertPhotoOutlinedIcon
                  sx={{ stroke: "#ffffff", strokeWidth: 1, fontSize: "8rem" }}
                />
              </Grid>
              <Grid textAlign="center">Grafika</Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item container direction={"column"} alignItems={"center"}>
          <Grid item>
            <IconButton aria-label="add" size="large" onClick={handleActive}>
              <AddCircleIcon color="primary" fontSize="inherit" />
            </IconButton>
          </Grid>
          <Grid item>Dodaj blok odpowiedzi</Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default NewResponseBlock;
