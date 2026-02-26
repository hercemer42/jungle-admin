import { create } from "zustand";
import { fetchTables } from "../api/tables";
import { useTableDataStore } from "./useTableDataStore";

interface TablesState {
  tables: string[];
  selectedTable: string | null;
  loadTables: () => Promise<void>;
  setSelectedTable: (tableName: string) => void;
}

const useTablesStore = create<TablesState>((set) => ({
  tables: [],
  selectedTable: null,
  loadTables: async () => {
    const tables = await fetchTables();
    const firstTable = tables[0] || null;
    set({ tables, selectedTable: firstTable });
    if (firstTable) {
      await useTableDataStore.getState().loadTableData(firstTable);
    }
  },
  setSelectedTable: async (tableName: string) => {
    set({ selectedTable: tableName });
    await useTableDataStore.getState().loadTableData(tableName);
  },
}));

export { useTablesStore };
