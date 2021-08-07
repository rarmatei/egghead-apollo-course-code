import { NoteList } from "./NoteList";
import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { SelectCategory } from "./SelectCategory";
import { EditCategories } from "./EditCategories";

function MainNotesContainer() {
  const [notesCategory, setNotesCategory] = useState("1");
  return (
    <Stack width={400}>
      <SelectCategory
        defaultValue={notesCategory}
        onCategoryChange={(categoryId) => setNotesCategory(categoryId)}
      />
      <EditCategories />
      <NoteList categoryId={notesCategory} />
    </Stack>
  );
}

export { MainNotesContainer };
