import { Chip, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ResponseEditorContainer from "./responseEditorContainer";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

const DraggableResponse = (props: {
  messages: Array<{
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
  }>;
  saveMessage: (value: string, index: number) => void;
}) => {
  const { messages, saveMessage } = props;
  const [order, setOrder] = useState();

  const onDragEnd = result => {
    if (result.destination) {
      return;
    }

    const items = reorder(order, result.source.index, result.destination.index);

    setOrder({
      items,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {messages.map((message, i) => (
              <Draggable
                key={`draggable-${i}`}
                draggableId={`draggable-${i}`}
                index={i}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <ResponseEditorContainer
                      key={i}
                      message={message}
                      index={i}
                      saveMessage={saveMessage}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableResponse;
