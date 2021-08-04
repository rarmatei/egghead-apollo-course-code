import { NoteList } from "./NoteList";
import { Box, Button, Flex } from "@chakra-ui/react";
import { SlimNoteList } from "./SlimNoteList";
import { useState } from "react";

function MainNotesContainer() {
  const [slimListOpen, setSlimListOpen] = useState(false);
  return (
    <Flex>
      <NoteList />
      <Box width="300px" paddingLeft="50px">
        <Button onClick={() => setSlimListOpen(!slimListOpen)}>
          Open List
        </Button>
        {slimListOpen && <SlimNoteList />}
      </Box>
    </Flex>
  );
}

export { MainNotesContainer };
