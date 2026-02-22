import { create } from "zustand";
import { fetchTable } from "../api/table.ts";
import {
  convertServerDatesToInputDates,
  convertServerTypeToInputType,
} from "../utils/utils.ts";

type Row = Record<string, string | number | boolean | null | undefined>;

type Field = { name: string; type: string };

interface TableDataStore {
  rows: Row[];
  tableProperties: Field[];
  filters: Partial<Record<keyof Row, string>>;
  setFilterProperty: (filterProperty: keyof Row, filterValue: string) => void;
  loadTableData: (tableName: string) => Promise<void>;
  selectedRow: Row | null;
  openRowView: (row: Row) => void;
  closeRowView: () => void;
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
}));

export { useTableDataStore };
export type { Row, Field };
