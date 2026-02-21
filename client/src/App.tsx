import "./App.css";
import { Table } from "./components/Table/Table.tsx";
import { Filter } from "./components/UI/Filter/Filter.tsx";
import { RowView } from "./components/RowView/RowView.tsx";
import { Tables } from "./components/Tables/Tables.tsx";
import { useTablesStore } from "./store/useTablesStore.ts";

function App() {
  const currentTable = useTablesStore((state) => state.currentTable);

  return (
    <>
      <div className="side-panel">
        <Tables />
      </div>
      {currentTable ? (
        <div className="main-panel">
          <Filter />
          <Table />
          <RowView />
        </div>
      ) : (
        "select a table to view"
      )}
    </>
  );
}

export default App;
