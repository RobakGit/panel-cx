import { Chip, Grid, IconButton, TextField } from "@mui/material";
import { useState } from "react";
import TextEditor from "./textEditor";
import ButtonEditor from "./buttonEditor";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ImageEditor from "./imageEditor";

const ResponseEditorContainer = (props: {
  message: {
    text?: { text: Array<string> };
    payload?: {
      richContent?: Array<
        Array<
          | {
              type: "chips";
              options: Array<{ text?: string }>;
            }
          | {
              type: "image";
              rawUrl: string;
              accessibilityText: string;
            }
        >
      >;
    };
  };
  index: number;
  saveMessage: (
    value: string | { type: string; rawUrl: string; accessibilityText: string },
    index: number,
    type: string
  ) => void;
}) => {
  const { message, index, saveMessage } = props;
  const editMessage = (value: string) => {
    saveMessage(value, index, "text");
  };

  const editButton = (option: { text: string }, optionIndex: number) => {
    let options = message.payload.richContent[0][0].options;
    options[optionIndex] = option;
    saveMessage(options, index, "button");
  };

  const removeButton = (optionIndex: number) => {
    let options = message.payload.richContent[0][0].options;
    options.splice(optionIndex, 1);
    saveMessage(options, index, "button");
  };

  const editImage = (imageData: {
    rawUrl: string;
    accessibilityText: string;
  }) => {
    saveMessage({ type: "image", ...imageData }, index, "image");
  };

  if (message.text) {
    return (
      <Grid
        item
        display={"flex"}
        flexDirection={"column"}
        bgcolor={"primary.contrastText"}
        m={1}
        p={2}
        borderRadius={2}
        boxShadow={1}
        alignItems={"center"}
      >
        <b>{index} </b>
        ilość rotacyjnych: {message.text.text.length}
        <TextEditor text={message.text.text[0]} editMessage={editMessage} />
      </Grid>
    );
  } else if (message.payload && message.payload.richContent) {
    const richContent = message.payload.richContent[0];
    if (richContent[0] && richContent[0].type === "chips") {
      return (
        <Grid
          item
          display={"flex"}
          flexDirection={"column"}
          bgcolor={"primary.contrastText"}
          m={1}
          p={2}
          borderRadius={2}
          boxShadow={1}
          alignItems={"center"}
          rowGap={1}
        >
          <b>{index}-chips- </b>
          {richContent[0].options?.map((option, i) => (
            <ButtonEditor
              key={`${index}-${option.text}-${i}`}
              index={i}
              text={option.text}
              editButton={editButton}
              removeButton={removeButton}
            />
          ))}
          <IconButton
            onClick={() =>
              editButton({ text: "" }, richContent[0].options.length)
            }
          >
            <AddCircleIcon color="primary" />
          </IconButton>
        </Grid>
      );
    } else if (richContent[0] && richContent[0].type === "image") {
      return (
        <ImageEditor
          index={index}
          imageData={richContent[0]}
          editImage={editImage}
        />
      );
    } else {
      return (
        <Grid item>
          <b>{index}-unknownRich- </b>
          {JSON.stringify(message.payload.richContent)}
        </Grid>
      );
    }
  } else {
    return (
      <Grid item>
        <b>{index}-else- </b>
        {JSON.stringify(message)}
      </Grid>
    );
  }
};

export default ResponseEditorContainer;
