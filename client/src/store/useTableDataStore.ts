import { create } from "zustand";
import { rows, type Row } from "../data/table_data.ts";

interface TableDataStore {
  rows: Row[];
  tableProperties: (keyof Row)[];
  filters: Partial<Record<keyof Row, string>>;
  setFilterProperty: (filterProperty: keyof Row, filterValue: string) => void;
  selectedRow: Row | null;
  openRowView: (row: Row) => void;
  closeRowView: () => void;
}

const useTableDataStore = create<TableDataStore>((set) => ({
  rows: rows,
  tableProperties: Object.keys(rows[0]) as (keyof Row)[],
  filters: {},
  setFilterProperty: (filterProperty, filterValue) =>
    set((state) => ({
      filters: { ...state.filters, [filterProperty]: filterValue },
    })),
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

export { useTableDataStore, type Row };
