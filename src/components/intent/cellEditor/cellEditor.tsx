import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { MutableRefObject, useRef, useState } from "react";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
} from "draft-js";
import React from "react";
import { stateToHTML } from "draft-js-export-html";
import { convertFromHTML as convertFromHTMLConverter } from "draft-convert";
import stc from "string-to-color";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from "uuid";
import diff from "fast-diff";

const CellEditor = (props: {
  parameters: Array<{ auto: boolean; text: string; parameterId?: string }>;
  entities: Array<{ id: string; entityType: string }>;
  editMessage: (
    value: string,
    parameters: Array<{ auto: boolean; text: string; parameterId?: string }>
  ) => void;
}) => {
  const { editMessage, parameters, entities } = props;
  const [paramState, setParamState] = useState(parameters);
  const [entityPopup, setEntityPopup] = useState<{
    x: number;
    y: number;
    parameter?: string;
    startOffset: number;
    endOffset: number;
  } | null>(null);
  console.log("initState", paramState);

  const findLinkEntities = (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) => {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "MARK"
      );
    }, callback);
  };

  const Entity = (props: any) => {
    const { parameter } = props.contentState
      .getEntity(props.entityKey)
      .getData();
    return (
      <span
        data-parameter={parameter}
        style={{
          backgroundColor: stc(parameter) + 33,
        }}
      >
        {props.children}
      </span>
    );
  };

  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Entity,
    },
  ]);

  const state = convertFromHTMLConverter({
    htmlToEntity: (nodeName, node, createEntity) => {
      if (nodeName === "mark") {
        return createEntity("MARK", "MUTABLE", {
          parameter: node.getAttribute("data-parameter"),
        });
      }
    },
  })(
    paramState
      .map(phrase => {
        let text = "";
        if (phrase.parameterId) {
          text = `<mark data-parameter="${phrase.parameterId}">${phrase.text}</mark>`;
        } else {
          text = phrase.text;
        }
        return text;
      })
      .join("")
      .replace(/\n/g, "<br>")
  );
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(state, decorator)
  );

  const editor = useRef<Editor | null>(null);

  const focusEditor = () => {
    if (editor.current) {
      editor.current.focus();
    }
  };

  const convertHtmlText = (html: string) => {
    html = html.replace(/<br>|<p>|<\/p>/g, "");
    return html.trim();
  };

  const blur = () => {
    editMessage(
      convertHtmlText(stateToHTML(editorState.getCurrentContent())),
      paramState
    );
  };

  const findEditedFragment = (
    startOffset: number,
    editedFragment: string,
    sumOfTextLenght: number,
    index: number
  ) => {
    while (sumOfTextLenght <= startOffset) {
      index++;
      if (paramState[index]) {
        editedFragment = paramState[index].text;
      } else {
        editedFragment = "";
        break;
      }
      sumOfTextLenght += editedFragment.length;
    }
    return { editedFragment, sumOfTextLenght, index };
  };

  const onEntitySelect = ({
    event,
    parameter,
    startOffset,
    endOffset,
  }: {
    event: SelectChangeEvent;
    parameter?: string;
    startOffset: number;
    endOffset: number;
  }) => {
    console.log(
      "select",
      event.target.value,
      parameter,
      startOffset,
      endOffset
    );
    const { editedFragment, sumOfTextLenght, index } = findEditedFragment(
      startOffset,
      paramState[0].text,
      paramState[0].text.length,
      0
    );
    let newParams: Array<{
      auto: boolean;
      text: string;
      parameterId?: string;
    }> = paramState;

    if (startOffset == endOffset) {
      if (event.target.value === "null") {
        let newParam = paramState[index];
        delete newParam.parameterId;
        newParams[index] = newParam;
      } else {
        newParams[index].parameterId = event.target.value;
      }
    } else {
      const newStartOffset =
        startOffset - (sumOfTextLenght - editedFragment.length);
      const newEndOffset =
        endOffset - (sumOfTextLenght - editedFragment.length);
      const testSlice = editedFragment.slice(newStartOffset, newEndOffset);

      const slicedParams: Array<{
        auto: boolean;
        text: string;
        parameterId?: string;
      }> = [];
      newParams = [];
      const prevEntityText = editedFragment.slice(0, newStartOffset);
      const afterEntityText = editedFragment.slice(
        newEndOffset,
        editedFragment.length
      );
      if (prevEntityText) {
        slicedParams.push({ auto: true, text: prevEntityText });
      }
      slicedParams.push({
        auto: true,
        text: testSlice,
        parameterId: event.target.value,
      });
      if (afterEntityText) {
        slicedParams.push({ auto: true, text: afterEntityText });
      }
      paramState.forEach((param, paramIndex) => {
        if (paramIndex === index) {
          newParams = [...newParams, ...slicedParams];
        } else {
          newParams.push(param);
        }
      });
    }
    setParamState(newParams);
  };

  const editorChange = (neweditorState: EditorState) => {
    let newParams: Array<{
      auto: boolean;
      text: string;
      parameterId?: string;
    }> = paramState;
    const selectionState = neweditorState.getSelection();
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const currentContent = neweditorState.getCurrentContent();
    const blockForKey = currentContent.getBlockForKey(
      selectionState.getStartKey()
    );
    const selectedText = blockForKey.getText().slice(start, end);
    const entityKey = blockForKey.getEntityAt(start);
    const selection = window.getSelection();
    if (selection && selection.focusOffset > 0) {
      const range = window.getSelection()?.getRangeAt(0).cloneRange();
      if (entityKey) {
        const { parameter } = currentContent.getEntity(entityKey).getData();
        if (range) {
          const rect = range.getBoundingClientRect();
          setEntityPopup({
            x: rect.x,
            y: rect.y,
            parameter: parameter,
            startOffset: start,
            endOffset: end,
          });
        }
      } else if (selectedText) {
        if (range) {
          const rect = range.getBoundingClientRect();
          setEntityPopup({
            x: rect.x,
            y: rect.y,
            startOffset: start,
            endOffset: end,
          });
        }
      }
    }
    const valueDiffrences = diff(
      editorState.getCurrentContent().getPlainText(),
      neweditorState.getCurrentContent().getPlainText()
    );
    if (valueDiffrences.length > 1) {
      const offSet = valueDiffrences[0][1].length;
      const { editedFragment, sumOfTextLenght, index } = findEditedFragment(
        offSet,
        paramState[0].text,
        paramState[0].text.length,
        0
      );
      console.log("editedFragment", editedFragment);
      const newOffset = offSet - (sumOfTextLenght - editedFragment.length);
      console.log(
        "timeToEdit",
        editedFragment.slice(0, newOffset),
        editedFragment.slice(newOffset)
      );
      if (valueDiffrences[1][0] === 1) {
        const newText = [
          editedFragment.slice(0, newOffset),
          valueDiffrences[1][1],
          editedFragment.slice(newOffset),
        ].join("");
        console.log("new", newText);
        if (newParams[index]) {
          newParams[index].text = newText;
        } else {
          newParams[index] = { auto: true, text: newText };
        }
      }
      if (valueDiffrences[1][0] === -1) {
        const newText = [
          editedFragment.slice(0, newOffset),
          editedFragment.slice(newOffset + valueDiffrences[1][1].length),
        ].join("");
        console.log("new", newText);
        newParams[index].text = newText;
      }
      console.log(
        offSet,
        editorState
          .getCurrentContent()
          .getPlainText()
          .slice(offSet, offSet + 2)
      );
      setParamState(newParams);
    }
    setEditorState(neweditorState);
  };

  return (
    <div onClick={focusEditor} style={{ width: "100%" }}>
      <Editor
        ref={editor}
        editorState={editorState}
        keyBindingFn={SyntheticKey => {
          if (SyntheticKey.key.includes("Arrow")) {
            return "cancel-action";
          }
          return getDefaultKeyBinding(SyntheticKey);
        }}
        onChange={editorChange}
        onBlur={blur}
      />
      {entityPopup &&
        document.body?.firstElementChild?.firstElementChild &&
        ReactDOM.createPortal(
          <div
            style={{ position: "fixed", width: "100vw", height: "100vh" }}
            onClick={() => setEntityPopup(null)}
          >
            <div
              style={{
                position: "absolute",
                top: entityPopup.y + 40,
                left: entityPopup.x,
              }}
            >
              <Select
                sx={{ backgroundColor: "#eee" }}
                value={entityPopup.parameter ?? "null"}
                onChange={e =>
                  onEntitySelect({
                    event: e,
                    parameter: entityPopup.parameter ?? undefined,
                    startOffset: entityPopup.startOffset,
                    endOffset: entityPopup.endOffset,
                  })
                }
              >
                <MenuItem value="null">Brak Encji</MenuItem>
                {entities.map(entity => (
                  <MenuItem key={uuidv4()} value={entity.id}>
                    {entity.entityType}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>,
          document.body.firstElementChild.firstElementChild
        )}
    </div>
  );
};

export default CellEditor;
