import { useTableDataStore } from "../../store/useTableDataStore";

function Pagination() {
  const page = useTableDataStore((state) => state.page);
  const setNextPage = useTableDataStore((state) => state.setNextPage);
  const setPreviousPage = useTableDataStore((state) => state.setPreviousPage);
  const pageCount = useTableDataStore((state) => state.pageCount);

  if (pageCount <= 0) return null;

  return (
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
  );
}

export { Pagination };
