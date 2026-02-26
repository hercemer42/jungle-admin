import "./App.css";
import { Table } from "./components/Table/Table.tsx";
import { Filter } from "./components/Filter/Filter.tsx";
import { RowView } from "./components/RowView/RowView.tsx";
import { Toaster } from "./components/UI/Toast/Toast.tsx";
import { Tables } from "./components/Tables/Tables.tsx";

function App() {
  return (
    <>
      <Tables />
      <Filter />
      <Table />
      <RowView />
      <Toaster />
    </>
  );
}

export default App;
