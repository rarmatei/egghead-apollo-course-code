import { useParams } from "react-router-dom";
import { UiEditNote } from "./shared-ui/UiEditNote";

export function EditNote() {
  let { noteId } = useParams();

  const mockNote = {
    id: noteId,
    content: "mock, hardcoded content",
  };
  return (
    <UiEditNote
      note={mockNote}
      onSave={(content) => console.log("new content: ", content)}
    />
  );
}
