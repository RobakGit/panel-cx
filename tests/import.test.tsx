import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ImportPopUp from "@/components/popups/importPopUp";

describe("ImportPopUp", () => {
  it("renders the component", () => {
    const isImportOpen = true;
    const closeImportPopUp = jest.fn();

    render(
      <ImportPopUp
        isImportOpen={isImportOpen}
        closeImportPopUp={closeImportPopUp}
      />
    );

    expect(screen.getByText("Nazwa agenta z dialogflow")).toBeInTheDocument();
    expect(screen.getByText("Nazwa własna agenta")).toBeInTheDocument();
    expect(screen.getByText("Importuj")).toBeInTheDocument();
    expect(screen.getByText("Anuluj")).toBeInTheDocument();
  });

  it("calls closeImportPopUp when closed", () => {
    const isImportOpen = true;
    const closeImportPopUp = jest.fn();

    render(
      <ImportPopUp
        isImportOpen={isImportOpen}
        closeImportPopUp={closeImportPopUp}
      />
    );

    fireEvent.click(screen.getByText("Anuluj"));

    expect(closeImportPopUp).toHaveBeenCalled();
  });

  it("uploads a file when selected", () => {
    const isImportOpen = true;
    const closeImportPopUp = jest.fn();

    render(
      <ImportPopUp
        isImportOpen={isImportOpen}
        closeImportPopUp={closeImportPopUp}
      />
    );

    const file = new File(["dummy content"], "test.png", { type: "image/png" });

    const fileInput = screen.getByLabelText("Upload File");
    Object.defineProperty(fileInput, "files", { value: [file] });
    fireEvent.change(fileInput);

    expect(screen.getByText("test.png")).toBeInTheDocument();
  });
});
