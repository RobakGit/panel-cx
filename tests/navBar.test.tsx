import React from "react";
import { render, screen } from "@testing-library/react";
import SideNavigationBarContainer from "../src/components/navigation/sideNavigationBar/sideNavigationBarContainer";
import SideNavigationListContainer from "../src/components/navigation/sideNavigationList/sideNavigationListContainer";
import { act } from "react-dom/test-utils";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => {
      return [{ displayName: "testAgent", uid: "1" }];
    },
  })
);

const drawerWidth = 240;

describe("SideNavigationBarContainer", () => {
  test("renders side navigation items correctly", async () => {
    render(
      <SideNavigationBarContainer drawerWidth={drawerWidth} open={true} />
    );
    await act(async () => {
      await new Promise(resolve => {
        setTimeout(resolve, 50);
      });
    });

    expect(screen.getByText("Intencje")).toBeInTheDocument();
    expect(screen.getByText("Encje")).toBeInTheDocument();
    expect(screen.getByText("Page")).toBeInTheDocument();
    expect(screen.getByText("Testy automatyczne")).toBeInTheDocument();
  });
});

describe("SideNavigationListContainer", () => {
  test("renders list elements correctly", () => {
    const listElements = [
      { displayName: "Item 1", uid: "item1" },
      { displayName: "Item 2", uid: "item2" },
      { displayName: "Item 3", uid: "item3" },
    ];

    render(
      <SideNavigationListContainer listElements={listElements} type="list" />
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });
});
