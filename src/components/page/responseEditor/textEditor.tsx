import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  convertFromHTML,
} from "draft-js";
import React from "react";
import { stateToHTML } from "draft-js-export-html";

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

  return (
    <div onClick={focusEditor}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={editorState => setEditorState(editorState)}
        onBlur={blur}
      />
    </div>
  );
};

export default TextEditor;
