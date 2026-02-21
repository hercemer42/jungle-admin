import { create } from "zustand";
import { fetchTable } from "../api/table.ts";

type Row = Record<string, string | number | boolean | null | undefined>;

interface TableDataStore {
  rows: Row[];
  tableProperties: (keyof Row)[];
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
    if (tableData && tableData.length > 0) {
      set({
        tableProperties: Object.keys(tableData[0] || {}) as (keyof Row)[],
      });
      set({ rows: tableData });
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
export type { Row };
