import { create } from "zustand";
import { fetchTable } from "../api/tables.ts";
import { saveRow } from "../api/tables.ts";

import {
  convertServerDatesToInputDates,
  convertServerTypeToInputType,
  removeEmptyFilters,
} from "../utils/utils.ts";
import { useTablesStore } from "./useTablesStore.ts";
import type {
  Row,
  Field,
  ColumnFilters,
  SortColumn,
  SortDirection,
  ColumnFilterProperty,
} from "../types/types.tsx";

interface TableDataStore {
  rows: Row[];
  tableProperties: Field[];
  columnFilters: ColumnFilters;
  setFilterProperty: (
    filterProperty: ColumnFilterProperty,
    filterValue: string,
  ) => void;
  loadTableData: (tableName: string) => Promise<void>;
  selectedRow: Row | null;
  openRowView: (row: Row) => void;
  closeRowView: () => void;
  updateRow: (updatedRow: Row) => Promise<void>;
  sortColumn: SortColumn;
  setSortColumn: (column: SortColumn) => void;
  sortDirection: SortDirection;
  setSortDirection: (direction: SortDirection) => void;
  page: number;
  setNextPage: () => void;
  setPreviousPage: () => void;
  pageCount: number;
  primaryKeyColumns: string[];
}

const useTableDataStore = create<TableDataStore>((set) => ({
  rows: [],
  tableProperties: [],
  columnFilters: {},
  setFilterProperty: (filterProperty, filterValue) =>
    set((state) => ({
      columnFilters: { ...state.columnFilters, [filterProperty]: filterValue },
    })),
  loadTableData: async (tableName: string) => {
    const state = useTableDataStore.getState();
    const tableData = await fetchTable(
      tableName,
      state.page,
      state.columnFilters,
      state.sortColumn,
      state.sortDirection,
    );
    if (!tableData) {
      set({ tableProperties: [], rows: [] });
      return;
    }
    if (tableData.fields && tableData.fields.length > 0) {
      set({ tableProperties: convertServerTypeToInputType(tableData.fields) });
    }
    if (tableData.rows) {
      set({
        rows: convertServerDatesToInputDates(tableData.rows, tableData.fields),
      });
    }
    if (tableData.pageCount !== undefined) {
      set({ pageCount: tableData.pageCount });
    }
    if (tableData.page !== undefined) {
      set({ page: tableData.page });
    }

    if (tableData.primaryKeyColumns) {
      set({ primaryKeyColumns: tableData.primaryKeyColumns });
    }
  },
  selectedRow: null,
  openRowView: (row) =>
    set(() => ({
      selectedRow: row,
    })),
  closeRowView: () =>
    set(() => ({
      selectedRow: null,
    })),
  updateRow: async (updatedRow) => {
    const selectedRow = useTableDataStore.getState().selectedRow;
    if (!selectedRow) return;
    const selectedTable = useTablesStore.getState().selectedTable;
    const primaryKeys = useTableDataStore
      .getState()
      .primaryKeyColumns.map((col) => [
        col,
        selectedRow[col] as string | number,
      ]) as [string, string | number][];

    if (!selectedTable) return;
    const savedRow = await saveRow(selectedTable, updatedRow, primaryKeys);
    set((state) => {
      const convertedRow = convertServerDatesToInputDates(
        [savedRow],
        state.tableProperties,
      )[0];
      return {
        selectedRow: convertedRow,
        rows: state.rows.map((row) =>
          state.primaryKeyColumns.every((col) => row[col] === savedRow[col])
            ? convertedRow
            : row,
        ),
      };
    });
  },
  sortColumn: null,
  setSortColumn: (column) => {
    set((state) => {
      if (state.sortColumn !== column) {
        return { sortColumn: column, sortDirection: "asc" };
      }

      switch (state.sortDirection) {
        case "asc":
          return { sortColumn: column, sortDirection: "desc" };
        case "desc":
          return { sortColumn: null, sortDirection: null };
        case null:
          return { sortColumn: column, sortDirection: "asc" };
      }
    });
  },
  sortDirection: "asc",
  setSortDirection: (direction) =>
    set(() => ({
      sortDirection: direction,
    })),
  page: 1,
  setNextPage: () =>
    set((state) => ({
      page: state.page + 1,
    })),
  setPreviousPage: () =>
    set((state) => ({
      page: state.page - 1,
    })),
  pageCount: 0,
  primaryKeyColumns: [],
}));

useTableDataStore.subscribe((state, prevState) => {
  const sortChange =
    state.sortColumn !== prevState.sortColumn ||
    state.sortDirection !== prevState.sortDirection;
  const filterChange =
    JSON.stringify(removeEmptyFilters(state.columnFilters)) !==
    JSON.stringify(removeEmptyFilters(prevState.columnFilters));

  if ((sortChange || filterChange) && state.page !== 1) {
    useTableDataStore.setState({ page: 1 });
    return;
  }

  const shouldReload =
    sortChange || filterChange || state.page !== prevState.page;

  if (shouldReload) {
    const selectedTable = useTablesStore.getState().selectedTable;
    if (selectedTable) {
      useTableDataStore.getState().loadTableData(selectedTable);
    }
  }
});

export { useTableDataStore };
