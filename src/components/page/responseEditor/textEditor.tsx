import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  convertFromHTML,
  RichUtils,
} from "draft-js";
import React from "react";
import { stateToHTML } from "draft-js-export-html";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import LinkIcon from "@mui/icons-material/Link";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

const TextEditor = (props: {
  text: string;
  editMessage: (value: string) => void;
}) => {
  const { text, editMessage } = props;

  const findLinkEntities = (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) => {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      );
    }, callback);
  };

  const Link = (props: any) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    return (
      <a href={url} style={{ color: "blue" }}>
        {props.children}
      </a>
    );
  };

  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

  const blocksFromHTML = convertFromHTML(text.replace(/\n/g, "<br>"));
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  );
  const [editorState, setEditorState] = React.useState(
    // EditorState.createEmpty()
    EditorState.createWithContent(state, decorator)
  );

  const editor = React.useRef<Editor | null>(null);

  const focusEditor = () => {
    if (editor.current) {
      editor.current.focus();
    }
  };

  const convertHtmlText = (html: string) => {
    // html = html.slice(3, html.length - 4);
    html = html.replace(/<br>|<p>|<\/p>/g, "");
    return html.trim();
  };

  const blur = () => {
    editMessage(convertHtmlText(stateToHTML(editorState.getCurrentContent())));
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const toggleUnorderedList = () => {
    setEditorState(
      RichUtils.toggleBlockType(editorState, "unordered-list-item")
    );
  };

  const toggleOrderedList = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, "ordered-list-item"));
  };

  return (
    <>
      <Grid item container direction={"row"} justifyContent={"end"}>
        <IconButton onClick={onBoldClick}>
          <FormatBoldIcon />
        </IconButton>
        <IconButton onClick={onBoldClick}>
          <LinkIcon />
        </IconButton>
        <IconButton onClick={toggleOrderedList}>
          <FormatListNumberedIcon />
        </IconButton>
        <IconButton onClick={toggleUnorderedList}>
          <FormatListBulletedIcon />
        </IconButton>
      </Grid>
      <div onClick={focusEditor} style={{ width: "100%" }}>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={editorState => setEditorState(editorState)}
          onBlur={blur}
        />
      </div>
    </>
  );
};

export default TextEditor;
