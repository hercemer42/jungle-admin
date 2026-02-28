import { beforeEach, describe, expect, it } from "vitest";
import { useTableDataStore } from "../../store/useTableDataStore";
import { render, screen } from "@testing-library/react";
import { Pagination } from "./Pagination";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  useTableDataStore.setState({
    page: 1,
    pageCount: 1,
  });
});

describe("Pagination", () => {
  it("renders pagination controls when there are rows", () => {
    useTableDataStore.setState({ page: 1, pageCount: 1 });
    render(<Pagination />);
    expect(screen.getByText(/1 of 1/)).toBeInTheDocument();
    expect(screen.getByText("›")).toBeInTheDocument();
    expect(screen.getByText("‹")).toBeInTheDocument();
  });

  it("does not render pagination controls when there are no rows", () => {
    useTableDataStore.setState({ page: 0, pageCount: 0 });
    render(<Pagination />);
    expect(screen.queryByText(/of/)).not.toBeInTheDocument();
    expect(screen.queryByText("›")).not.toBeInTheDocument();
    expect(screen.queryByText("‹")).not.toBeInTheDocument();
  });

  it("disables pagination buttons when on the first page", () => {
    useTableDataStore.setState({ page: 1, pageCount: 2 });
    render(<Pagination />);
    expect(screen.getByText("‹")).toBeDisabled();
  });

  it("disables pagination buttons when on the last page", async () => {
    useTableDataStore.setState({ page: 2, pageCount: 2 });
    render(<Pagination />);
    expect(screen.getByText("›")).toBeDisabled();
  });

  it("navigates to the next page when the Next button is clicked", async () => {
    useTableDataStore.setState({ page: 1, pageCount: 2 });
    render(<Pagination />);
    await userEvent.click(screen.getByText("›"));
    expect(screen.getByText(/2 of 2/)).toBeInTheDocument();
  });

  it("navigates to the previous page when the Previous button is clicked", async () => {
    useTableDataStore.setState({ page: 2, pageCount: 2 });
    render(<Pagination />);
    await userEvent.click(screen.getByText("‹"));
    expect(screen.getByText(/1 of 2/)).toBeInTheDocument();
  });
});
