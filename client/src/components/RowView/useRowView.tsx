import { useState } from "react";
import { useTableDataStore } from "../../store/useTableDataStore";
import { useToastStore } from "../../store/useToastStore";
import type { Row } from "../../types/types";

function useRowView() {
  const updateRow = useTableDataStore((state) => state.updateRow);
  const tableProperties = useTableDataStore((state) => state.tableProperties);
  const selectedRow = useTableDataStore((state) => state.selectedRow);
  const closeRowView = useTableDataStore((state) => state.closeRowView);
  const addToast = useToastStore((state) => state.addToast);
  const [editing, setEditing] = useState(false);

  const handleSave = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedRow = Object.fromEntries(formData) as Row;
    for (const prop of tableProperties) {
      if (prop.type === "checkbox") {
        updatedRow[prop.name] = formData.has(prop.name);
      }
    }
    try {
      await updateRow(updatedRow);
      setEditing(false);
      addToast({ message: "Row saved successfully", type: "success" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save row";
      addToast({ message, type: "error" });
    }
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
