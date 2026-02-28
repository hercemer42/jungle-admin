import { useEffect } from "react";
import { useTablesStore } from "../../store/useTablesStore";
import "./Tables.css";
import { formatTableAndColumnNames, onActivate } from "../../utils/utils";
import { LoadingSpinner } from "../UI/Icons/Icons";

function Tables() {
  const tables = useTablesStore((state) => state.tables);
  const loadTables = useTablesStore((state) => state.loadTables);
  const selectedTable = useTablesStore((state) => state.selectedTable);
  const setSelectedTable = useTablesStore((state) => state.setSelectedTable);
  const loading = useTablesStore((state) => state.loading);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  return (
    <div className="tables">
      {loading && <LoadingSpinner />}
      <ul className="tables">
        {tables.map((tableName) => (
          <li
            key={tableName}
            tabIndex={0}
            role="button"
            className={`table-card ${selectedTable === tableName ? "selected" : ""}`}
            onClick={() => setSelectedTable(tableName)}
            onKeyDown={onActivate(() => setSelectedTable(tableName))}
          >
            {formatTableAndColumnNames(tableName)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Tables };
