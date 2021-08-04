import { NoteList } from "./NoteList";
import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { SelectCategory } from "./SelectCategory";

function MainNotesContainer() {
  const [notesCategory, setNotesCategory] = useState("1");
  return (
    <Stack>
      <SelectCategory
        defaultValue={notesCategory}
        onCategoryChange={(categoryId) => setNotesCategory(categoryId)}
      />
      <Text>Selected Category ID: {notesCategory}</Text>
      <NoteList categoryId={notesCategory} />
    </Stack>
  );
}

export { MainNotesContainer };
