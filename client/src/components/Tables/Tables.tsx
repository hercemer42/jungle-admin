import { useEffect } from "react";
import { useTablesStore } from "../../store/useTablesStore";
import "./Tables.css";

function Tables() {
  const tables = useTablesStore((state) => state.tables);
  const loadTables = useTablesStore((state) => state.loadTables);
  const selectedTable = useTablesStore((state) => state.selectedTable);
  const setSelectedTable = useTablesStore((state) => state.setSelectedTable);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  return (
    <ul className="tables">
      {tables.map((table) => (
        <li
          key={table}
          className={`table-card ${selectedTable === table ? "selected" : ""}`}
          onClick={() => setSelectedTable(table)}
        >
          {table}
        </li>
      ))}
    </ul>
  );
}

export { Tables };
