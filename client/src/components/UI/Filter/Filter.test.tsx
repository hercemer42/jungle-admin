import { beforeEach, describe, expect, it } from "vitest";
import { useTableDataStore, type Field } from "../../../store/useTableDataStore";
import { render, screen } from "@testing-library/react";
import { Filter } from "./Filter";
import userEvent from "@testing-library/user-event";

const tableProperties: Field[] = [
  { name: "id", type: "number" },
  { name: "name", type: "text" },
  { name: "totalSpent", type: "number" },
];

beforeEach(() => {
  useTableDataStore.setState({
    filters: {},
    tableProperties,
  });
});

describe("Filter", () => {
  it("has no default filter set", () => {
    render(<Filter />);
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("adds filters when selected", async () => {
    render(<Filter />);
    for (const tableProperty of tableProperties) {
      await userEvent.selectOptions(
        screen.getByRole("combobox"),
        tableProperty.name,
      );
    }

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toEqual(3);
    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("totalSpent")).toBeInTheDocument();
  });

  it("does not add duplicate filters", async () => {
    render(<Filter />);
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");
    await userEvent.selectOptions(screen.getByRole("combobox"), "name");

    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("updates the filters when text is input", async () => {
    render(<Filter />);
    for (const tableProperty of tableProperties) {
      await userEvent.selectOptions(
        screen.getByRole("combobox"),
        tableProperty.name,
      );
    }

    const inputs = screen.getAllByRole("textbox");
    for (const [index, input] of inputs.entries()) {
      await userEvent.type(input, `text ${index}`);
      expect(input).toHaveValue(`text ${index}`);
    }

    const filters = useTableDataStore.getState().filters;

    for (const [index, tableProperty] of tableProperties.entries()) {
      expect(filters[tableProperty.name]).toEqual(`text ${index}`);
    }
  });
});
