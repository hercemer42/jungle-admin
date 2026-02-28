import styles from "./App.module.css";
import { Table } from "./components/Table/Table.tsx";
import { Filter } from "./components/Filter/Filter.tsx";
import { RowView } from "./components/RowView/RowView.tsx";
import { Toaster } from "./components/UI/Toast/Toast.tsx";
import { Tables } from "./components/Tables/Tables.tsx";
import { JungleLogo } from "./components/UI/Icons/Icons.tsx";
import { ErrorBoundary } from "./components/UI/ErrorBoundary/ErrorBoundary.tsx";

function App() {
  return (
    <ErrorBoundary>
      <div className={styles.logo}>
        <JungleLogo />
        <span>Jungle Admin</span>
      </div>
      <Tables />
      <Filter />
      <Table />
      <RowView />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
