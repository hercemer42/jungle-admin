import { create } from "zustand";
import { fetchTables } from "../api/tables";
import { useTableDataStore } from "./useTableDataStore";
import { useToastStore } from "./useToastStore";

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
    try {
      const tables = await fetchTables();
      const firstTable = tables[0] || null;
      set({ tables, selectedTable: firstTable });
      if (firstTable) {
        await useTableDataStore.getState().loadTableData(firstTable);
      }
    } catch {
      useToastStore
        .getState()
        .addToast({ message: "Failed to load tables", type: "error" });
    }
  },
  setSelectedTable: async (tableName: string) => {
    set({ selectedTable: tableName });
    useTableDataStore.setState({
      columnFilters: {},
      sortColumn: null,
      sortDirection: "asc",
      page: 1,
    });
    try {
      await useTableDataStore.getState().loadTableData(tableName);
    } catch {
      useToastStore
        .getState()
        .addToast({ message: "Failed to load table data", type: "error" });
    }
  },
}));

export { useTablesStore };
