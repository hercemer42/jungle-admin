import "./App.css";
import { Table } from "./components/Table/Table.tsx";
import { Filter } from "./components/UI/Filter/Filter.tsx";
import { RowView } from "./components/RowView/RowView.tsx";
import { Toaster } from "./components/UI/Toast/Toast.tsx";
import { Tables } from "./components/Tables/Tables.tsx";

function App() {
  return (
    <>
      <div className="side-panel">
        <Tables />
      </div>
      <div className="main-panel">
        <Filter />
        <Table />
        <RowView />
      </div>
      <Toaster />
    </>
  );
}

export default App;
