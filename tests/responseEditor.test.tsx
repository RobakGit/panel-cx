import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResponseEditorContainer from "@/components/page/responseEditor/responseEditorContainer";

describe("ResponseEditorContainer", () => {
  it("renders the component with text message", () => {
    const message = {
      text: { text: ["Hello"] },
    };
    const index = 0;
    const saveMessage = jest.fn();

    render(
      <ResponseEditorContainer
        message={message}
        index={index}
        saveMessage={saveMessage}
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders the component with chips message", () => {
    const message = {
      payload: {
        richContent: [
          [
            {
              type: "chips",
              options: [{ text: "Option 1" }, { text: "Option 2" }],
            },
          ],
        ],
      },
    };
    const index = 1;
    const saveMessage = jest.fn();

    render(
      <ResponseEditorContainer
        message={message}
        index={index}
        saveMessage={saveMessage}
      />
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("renders the component with image message", () => {
    const message = {
      text: null,
      payload: {
        richContent: [
          [
            {
              type: "image",
              rawUrl: "https://example.com/image.jpg",
              accessibilityText: "Image",
            },
          ],
        ],
      },
    };
    const index = 2;
    const saveMessage = jest.fn();

    render(
      <ResponseEditorContainer
        message={message}
        index={index}
        saveMessage={saveMessage}
      />
    );

    expect(screen.getByAltText("Image")).toBeInTheDocument();
  });

  it("renders the component with unknown rich content", () => {
    const message = {
      text: null,
      payload: {
        richContent: [
          [
            {
              type: "unknown",
              data: "Some data",
            },
          ],
        ],
      },
    };
    const index = 3;
    const saveMessage = jest.fn();

    render(
      <ResponseEditorContainer
        message={message}
        index={index}
        saveMessage={saveMessage}
      />
    );

    expect(
      screen.getByText(JSON.stringify(message.payload.richContent))
    ).toBeInTheDocument();
  });

  it("renders the component with unknown message type", () => {
    const message = {
      text: null,
      payload: null,
    };
    const index = 4;
    const saveMessage = jest.fn();

    render(
      <ResponseEditorContainer
        message={message}
        index={index}
        saveMessage={saveMessage}
      />
    );

    expect(screen.getByText(JSON.stringify(message))).toBeInTheDocument();
  });
});
