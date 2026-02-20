import "./App.css";
import { Table } from "./components/Table/Table.tsx";
import { Filter } from "./components/UI/Filter/Filter.tsx";
import { RowView } from "./components/RowView/RowView.tsx";

function App() {
  return (
    <>
      <Filter />
      <Table />
      <RowView />
    </>
  );
}

export default App;
