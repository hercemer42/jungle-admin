import { create } from "zustand";
import { fetchTable } from "../api/tables.ts";
import { saveRow } from "../api/tables.ts";

import {
  convertServerDatesToInputDates,
  convertServerTypeToInputType,
} from "../utils/utils.ts";
import { useTablesStore } from "./useTablesStore.ts";

type Row = Record<string, string | number | boolean | null | undefined>;

type Field = { name: string; type: string; editable: boolean };

interface TableDataStore {
  rows: Row[];
  tableProperties: Field[];
  filters: Partial<Record<keyof Row, string>>;
  setFilterProperty: (filterProperty: keyof Row, filterValue: string) => void;
  loadTableData: (tableName: string) => Promise<void>;
  selectedRow: Row | null;
  openRowView: (row: Row) => void;
  closeRowView: () => void;
  saveRow: (updatedRow: Row) => void;
}

const useTableDataStore = create<TableDataStore>((set) => ({
  rows: [],
  tableProperties: [],
  filters: {},
  setFilterProperty: (filterProperty, filterValue) =>
    set((state) => ({
      filters: { ...state.filters, [filterProperty]: filterValue },
    })),
  loadTableData: async (tableName: string) => {
    const tableData = await fetchTable(tableName);
    if (!tableData) {
      set({ tableProperties: [], rows: [] });
      return;
    }
    if (tableData.fields && tableData.fields.length > 0) {
      set({ tableProperties: convertServerTypeToInputType(tableData.fields) });
    }
    if (tableData.rows && tableData.rows.length > 0) {
      set({
        rows: convertServerDatesToInputDates(tableData.rows, tableData.fields),
      });
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
  saveRow: async (updatedRow) => {
    const selectedRow = useTableDataStore.getState().selectedRow;
    if (!selectedRow) return;
    const currentTable = useTablesStore.getState().currentTable;
    if (!currentTable) return;
    const savedRow = await saveRow(
      currentTable,
      updatedRow,
      selectedRow.id as number,
    );
    set((state) => {
      const convertedRow = convertServerDatesToInputDates(
        [savedRow],
        state.tableProperties,
      )[0];
      return {
        selectedRow: convertedRow,
        rows: state.rows.map((row) =>
          row.id === savedRow.id ? convertedRow : row,
        ),
      };
    });
  },
}));

export { useTableDataStore };
export type { Row, Field };
