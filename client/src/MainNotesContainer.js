import { Stack } from "@chakra-ui/react";
import { NoteList } from "./NoteList";

function MainNotesContainer() {
  return (
    <Stack>
      <NoteList />
    </Stack>
  );
}

export { MainNotesContainer };
