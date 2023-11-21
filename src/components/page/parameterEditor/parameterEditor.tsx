import {
  Checkbox,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import ResponseEditorContainer from "../responseEditor/responseEditorContainer";
import { useEffect, useState } from "react";
import { Entity } from "@prisma/client";
import NewResponseBlock from "../responseEditor/newResponseBlock";
import CancelIcon from "@mui/icons-material/Cancel";

const ParameterEditor = (props: {
  parameterIndex: number;
  parameter: {
    displayName: string;
    entityType: string;
    required: boolean;
    fillBehavior: {};
  };
  entities: Entity[];
  saveParameterForm: (
    parameter: {
      displayName: string;
      entityType: string;
      required: boolean;
      fillBehavior: {};
    },
    index: number,
    isReloadRequired: boolean
  ) => void;
}) => {
  const { parameter, entities, saveParameterForm, parameterIndex } = props;
  const [displayName, setDisplayName] = useState(parameter.displayName);
  const [entityType, setEntityType] = useState(parameter.entityType);
  const [isRequired, setIsRequired] = useState(parameter.required);

  const saveMessage = (
    value: string | { type: string; rawUrl: string; accessibilityText: string },
    index: number,
    type: string
  ) => {
    const messages = parameter.fillBehavior.initialPromptFulfillment.messages;
    if (messages && messages[index]) {
      let tempMessages = messages;
      if (type === "text") {
        tempMessages[index].text.text[0] = value;
      }
      if (type === "button") {
        tempMessages[index].payload.richContent[0][0].options = value;
      }
      if (type === "image" && typeof value === "object") {
        tempMessages[index].payload.richContent[0][0] = value;
      }
      let newParameter = parameter;
      newParameter.fillBehavior.initialPromptFulfillment.messages =
        tempMessages;
      if (type === "text") {
        return saveParameterForm(newParameter, parameterIndex, false);
      }
      saveParameterForm(newParameter, parameterIndex, true);
    }
  };

  const removeResponseBlock = (index: number) => {
    let newMessages = parameter.fillBehavior.initialPromptFulfillment.messages;
    newMessages.splice(index, 1);
    let newParameter = parameter;
    newParameter.fillBehavior.initialPromptFulfillment.messages = newMessages;
    saveParameterForm(newParameter, parameterIndex, true);
  };

  const addResponseBlock = (newBlock: any) => {
    let newMessages = parameter.fillBehavior.initialPromptFulfillment.messages;
    if (newMessages) {
      let newParameter = parameter;
      newMessages.push(newBlock);
      newParameter.fillBehavior.initialPromptFulfillment.messages = newMessages;
      saveParameterForm(newParameter, parameterIndex, true);
    }
  };

  return (
    <Paper>
      <TextField
        value={displayName}
        onChange={e => {
          setDisplayName(e.target.value);
        }}
      />
      <Select
        label="intentSelectorLabel"
        value={entityType}
        onChange={e => setEntityType(e.target.value)}
      >
        {entities.map(entity => (
          <MenuItem key={entity.displayName} value={`@${entity.displayName}`}>
            @{entity.displayName}
          </MenuItem>
        ))}
      </Select>
      <Checkbox
        checked={isRequired}
        onClick={() => {
          setIsRequired(!isRequired);
        }}
      />
      {parameter.fillBehavior.initialPromptFulfillment &&
        parameter.fillBehavior.initialPromptFulfillment.messages &&
        parameter.fillBehavior.initialPromptFulfillment.messages.map(
          (message, i) => (
            <div key={uuidv4()} style={{ position: "relative" }}>
              <IconButton
                sx={{ position: "absolute", right: 0 }}
                onClick={() => removeResponseBlock(i)}
              >
                <CancelIcon />
              </IconButton>
              <ResponseEditorContainer
                key={uuidv4()}
                message={message}
                index={i}
                saveMessage={saveMessage}
              />
            </div>
          )
        )}
      <NewResponseBlock addResponseBlock={addResponseBlock} />
    </Paper>
  );
};

export default ParameterEditor;
