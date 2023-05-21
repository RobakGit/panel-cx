import { Chip, Grid, TextField } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import TextEditor from "./textEditor";

const ResponseEditorContainer = (props: {
  message: {
    text?: { text: string };
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
  saveMessage: (value: string, index: number) => void;
}) => {
  const { message, index, saveMessage } = props;
  const editMessage = (value: string) => {
    saveMessage(value, index);
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
          {richContent[0].options?.map(option => (
            <Grid key={option.text}>
              <Chip label={option.text} />
            </Grid>
          ))}
        </Grid>
      );
    } else if (richContent[0] && richContent[0].type === "image") {
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
          <b>{index}-imageRich- </b>
          <Image
            src={richContent[0].rawUrl}
            alt={richContent[0].accessibilityText}
            width={300}
            height={200}
          />
          <TextField fullWidth label="url" value={richContent[0].rawUrl} />
          <TextField
            fullWidth
            label="accessibilityText"
            value={richContent[0].accessibilityText}
          />
        </Grid>
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
