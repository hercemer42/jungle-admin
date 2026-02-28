import { create } from "zustand";
import { fetchTable } from "../api/tables.ts";
import { saveRow } from "../api/tables.ts";

import {
  convertServerDatesToInputDates,
  convertServerTypeToInputType,
  removeEmptyFilters,
} from "../utils/utils.ts";
import { useTablesStore } from "./useTablesStore.ts";
import { useToastStore } from "./useToastStore.ts";
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
  removeFilterProperty: (filterProperty: ColumnFilterProperty) => void;
  loading: boolean;
  loadTableData: (tableName: string) => Promise<void>;
  selectedRow: Row | null;
  openRowView: (row: Row) => void;
  closeRowView: () => void;
  editing: boolean;
  setEditing: (editing: boolean) => void;
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

const useTableDataStore = create<TableDataStore>((set, get) => ({
  rows: [],
  tableProperties: [],
  columnFilters: {},
  setFilterProperty: (filterProperty, filterValue) =>
    set((state) => ({
      columnFilters: { ...state.columnFilters, [filterProperty]: filterValue },
    })),
  removeFilterProperty: (filterProperty) =>
    set((state) => {
      const { [filterProperty]: _unused, ...rest } = state.columnFilters;
      void _unused;
      return { columnFilters: rest };
    }),
  loading: false,
  loadTableData: async (tableName: string) => {
    set({ loading: true });
    try {
      const state = get();
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
        set({
          tableProperties: convertServerTypeToInputType(tableData.fields),
        });
      }
      if (tableData.rows) {
        set({
          rows: convertServerDatesToInputDates(
            tableData.rows,
            tableData.fields,
          ),
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
    } catch (e) {
      useToastStore.getState().addToast({
        message: e instanceof Error ? e.message : "Failed to load table data",
        type: "error",
      });
    } finally {
      set({ loading: false });
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
      editing: false,
    })),
  editing: false,
  setEditing: (editing) => set({ editing }),
  updateRow: async (updatedRow) => {
    const selectedRow = get().selectedRow;
    if (!selectedRow) return;
    const selectedTable = useTablesStore.getState().selectedTable;
    const primaryKeys = get().primaryKeyColumns.map((col) => [
      col,
      selectedRow[col] as string | number,
    ]) as [string, string | number][];

    if (!selectedTable) return;
    try {
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
      set({ editing: false });
      useToastStore
        .getState()
        .addToast({ message: "Row saved successfully", type: "success" });
    } catch (e) {
      useToastStore.getState().addToast({
        message: e instanceof Error ? e.message : "Failed to save row",
        type: "error",
      });
    }
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
  sortDirection: null,
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
