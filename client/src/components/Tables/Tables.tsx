import { useEffect } from "react";
import { useTablesStore } from "../../store/useTablesStore";
import "./Tables.css";

function Tables() {
  const tables = useTablesStore((state) => state.tables);
  const loadTables = useTablesStore((state) => state.loadTables);
  const currentTable = useTablesStore((state) => state.currentTable);
  const setSelectedTable = useTablesStore((state) => state.setSelectedTable);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  return (
    <ul className="tables">
      {tables.map((table) => (
        <li
          key={table}
          className={`table-card ${currentTable === table ? "selected" : ""}`}
          onClick={() => setSelectedTable(table)}
        >
          {table}
        </li>
      ))}
    </ul>
  );
}

export { Tables };
