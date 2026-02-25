import { useState } from "react";
import { useTableDataStore } from "../../store/useTableDataStore";
import type { Row } from "../../types/types";

function useRowView() {
  const saveRow = useTableDataStore((state) => state.saveRow);
  const tableProperties = useTableDataStore((state) => state.tableProperties);
  const selectedRow = useTableDataStore((state) => state.selectedRow);
  const closeRowView = useTableDataStore((state) => state.closeRowView);
  const [editing, setEditing] = useState(false);

  const handleSave = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedRow = Object.fromEntries(formData) as Row;
    for (const prop of tableProperties) {
      if (prop.type === "checkbox") {
        updatedRow[prop.name] = formData.has(prop.name);
      }
    }
    saveRow(updatedRow);
    setEditing(false);
  };

  return {
    handleSave,
    editing,
    setEditing,
    selectedRow,
    closeRowView,
    tableProperties,
  };
}

export default useRowView;
