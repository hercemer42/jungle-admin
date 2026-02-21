import { useTable } from "./useTable";
import "./Table.css";

function Table() {
  const {
    tableProperties,
    paginatedRows,
    sort,
    sortColumn,
    sortDesc,
    page,
    nextPage,
    previousPage,
    pageCount,
    openRow,
    currentTable,
  } = useTable();

  return (
    <div>
      <table className="table-rows">
        <thead>
          <tr>
            {tableProperties.map((property) => (
              <th key={property} onClick={() => sort(property)}>
                {property}
                {property === sortColumn ? (sortDesc ? " ▼" : " ▲") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedRows.length > 0 ? (
            paginatedRows.map((row) => (
              <tr key={String(row.id)} onClick={() => openRow(row)}>
                {tableProperties.map((property) => (
                  <td key={property}>{row[property]}</td>
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
          <button onClick={nextPage} disabled={page >= pageCount}>
            Next
          </button>
          <button onClick={previousPage} disabled={page === 1}>
            Previous
          </button>
        </div>
      )}
    </div>
  );
}

export { Table };
