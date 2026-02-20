import { useTable } from "./useTable";
import "./Table.css";

function Table() {
  const {
    tableProperties,
    paginatedCustomers,
    sort,
    sortColumn,
    sortDesc,
    page,
    nextPage,
    previousPage,
    pageCount,
    openCustomerRow,
  } = useTable();

  return (
    <div>
      <table className="customer-table">
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
          {paginatedCustomers.length > 0 ? (
            paginatedCustomers.map((customer) => (
              <tr key={customer.id} onClick={() => openCustomerRow(customer)}>
                {tableProperties.map((property) => (
                  <td key={property}>{customer[property]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tableProperties.length}>No results found</td>
            </tr>
          )}
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
