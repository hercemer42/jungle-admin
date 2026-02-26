import { create } from "zustand";
import { fetchTables } from "../api/tables";
import { useTableDataStore } from "./useTableDataStore";

interface TablesState {
  tables: string[];
  currentTable: string | null;
  loadTables: () => Promise<void>;
  setSelectedTable: (tableName: string) => void;
}

const useTablesStore = create<TablesState>((set) => ({
  tables: [],
  currentTable: null,
  loadTables: async () => {
    const tables = await fetchTables();
    set({ tables });
  },
  setSelectedTable: async (tableName: string) => {
    set({ currentTable: tableName });
    await useTableDataStore.getState().loadTableData(tableName);
  },
}));

export { useTablesStore };
