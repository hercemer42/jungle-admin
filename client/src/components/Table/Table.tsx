import "./Table.css";
import { useTablesStore } from "../../store/useTablesStore";
import { useTableDataStore } from "../../store/useTableDataStore";

function Table() {
  const rows = useTableDataStore((state) => state.rows);
  const tableProperties = useTableDataStore((state) => state.tableProperties);
  const currentTable = useTablesStore((state) => state.currentTable);
  const openRowView = useTableDataStore((state) => state.openRowView);
  const sortColumn = useTableDataStore((state) => state.sortColumn);
  const setSortColumn = useTableDataStore((state) => state.setSortColumn);
  const sortDirection = useTableDataStore((state) => state.sortDirection);
  const page = useTableDataStore((state) => state.page);
  const setNextPage = useTableDataStore((state) => state.setNextPage);
  const setPreviousPage = useTableDataStore((state) => state.setPreviousPage);
  const pageCount = useTableDataStore((state) => state.pageCount);
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
                {property.name}
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
                  <td key={property.name}>
                    {String(row[property.name] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          ) : currentTable ? (
            <tr>
              <td colSpan={tableProperties.length}>No results found</td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {pageCount > 0 && (
        <div>
          <span>
            Page {page} of {pageCount}
          </span>
          <button onClick={() => setNextPage()} disabled={page >= pageCount}>
            Next
          </button>
          <button onClick={() => setPreviousPage()} disabled={page === 1}>
            Previous
          </button>
        </div>
      )}
    </div>
  );
}

export { Table };
