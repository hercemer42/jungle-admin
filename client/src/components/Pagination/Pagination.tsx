import { useTableDataStore } from "../../store/useTableDataStore";
import "./Pagination.css";

function Pagination() {
  const page = useTableDataStore((state) => state.page);
  const setNextPage = useTableDataStore((state) => state.setNextPage);
  const setPreviousPage = useTableDataStore((state) => state.setPreviousPage);
  const pageCount = useTableDataStore((state) => state.pageCount);

  if (pageCount <= 0) return null;

  return (
    <div className="pagination">
      <button onClick={() => setPreviousPage()} disabled={page === 1}>
        ‹
      </button>
      <span>
        {page} of {pageCount}
      </span>
      <button onClick={() => setNextPage()} disabled={page >= pageCount}>
        ›
      </button>
    </div>
  );
}

export { Pagination };
