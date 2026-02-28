import { create } from "zustand";
import { fetchTables } from "../api/tables";
import { useTableDataStore } from "./useTableDataStore";
import { useToastStore } from "./useToastStore";

interface TablesState {
  tables: string[];
  selectedTable: string | null;
  loadTables: () => Promise<void>;
  setSelectedTable: (tableName: string) => void;
  loading: boolean;
}

const useTablesStore = create<TablesState>((set) => ({
  tables: [],
  selectedTable: null,
  loading: false,
  loadTables: async () => {
    set({ loading: true });
    try {
      const tables = await fetchTables();
      const firstTable = tables[0] || null;
      set({ tables, selectedTable: firstTable, loading: false });
      if (firstTable) {
        await useTableDataStore.getState().loadTableData(firstTable);
      }
    } catch {
      useToastStore
        .getState()
        .addToast({ message: "Failed to load tables", type: "error" });
    } finally {
      set({ loading: false });
    }
  },
  setSelectedTable: async (tableName: string) => {
    set({ selectedTable: tableName });
    useTableDataStore.setState({
      columnFilters: {},
      sortColumn: null,
      sortDirection: null,
      page: 1,
    });
    await useTableDataStore.getState().loadTableData(tableName);
  },
}));

export { useTablesStore };
