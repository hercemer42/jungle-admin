import "./Table.css";
import { useTablesStore } from "../../store/useTablesStore";
import { useTableDataStore } from "../../store/useTableDataStore";
import { formatCellValue, formatTableAndColumnNames } from "../../utils/utils";
import { Pagination } from "../Pagination/Pagination";

function Table() {
  const rows = useTableDataStore((state) => state.rows);
  const tableProperties = useTableDataStore((state) => state.tableProperties);
  const selectedTable = useTablesStore((state) => state.selectedTable);
  const openRowView = useTableDataStore((state) => state.openRowView);
  const sortColumn = useTableDataStore((state) => state.sortColumn);
  const setSortColumn = useTableDataStore((state) => state.setSortColumn);
  const sortDirection = useTableDataStore((state) => state.sortDirection);
  const primaryKeyColumns = useTableDataStore(
    (state) => state.primaryKeyColumns,
  );

  return (
    <div>
      <table className="table-rows">
        <thead>
          <tr>
            {tableProperties.map((property) => (
              <th
                key={property.name}
                onClick={() => setSortColumn(property.name)}
              >
                {formatTableAndColumnNames(property.name)}
                {property.name === sortColumn
                  ? sortDirection === "desc"
                    ? " ▼"
                    : " ▲"
                  : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr
                key={primaryKeyColumns.map((col) => row[col]).join("-")}
                onClick={() => openRowView(row)}
              >
                {tableProperties.map((property) => (
                  <td
                    key={property.name}
                    className={
                      property.type === "datetime-local" ||
                      property.type === "date"
                        ? "date"
                        : ""
                    }
                  >
                    {formatCellValue(row[property.name], property.type)}
                  </td>
                ))}
              </tr>
            ))
          ) : selectedTable ? (
            <tr>
              <td colSpan={tableProperties.length}>No results found</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
}

export { Table };
