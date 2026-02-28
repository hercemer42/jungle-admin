import { useTableDataStore } from "../../store/useTableDataStore";
import type { Row } from "../../types/types";

function useRowView() {
  const updateRow = useTableDataStore((state) => state.updateRow);
  const tableProperties = useTableDataStore((state) => state.tableProperties);
  const selectedRow = useTableDataStore((state) => state.selectedRow);
  const closeRowView = useTableDataStore((state) => state.closeRowView);
  const editing = useTableDataStore((state) => state.editing);
  const setEditing = useTableDataStore((state) => state.setEditing);

  const handleSave = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedRow = Object.fromEntries(formData) as Row;
    for (const prop of tableProperties) {
      if (prop.type === "checkbox") {
        updatedRow[prop.name] = formData.has(prop.name);
      }
    }
    await updateRow(updatedRow);
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
