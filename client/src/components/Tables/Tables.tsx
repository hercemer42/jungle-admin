import { useEffect } from "react";
import { useTablesStore } from "../../store/useTablesStore";
import "./Tables.css";
import { formatTableAndColumnNames } from "../../utils/utils";

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
      {tables.map((tableName) => (
        <li
          key={tableName}
          className={`table-card ${selectedTable === tableName ? "selected" : ""}`}
          onClick={() => setSelectedTable(tableName)}
        >
          {formatTableAndColumnNames(tableName)}
        </li>
      ))}
    </ul>
  );
}

export { Tables };
