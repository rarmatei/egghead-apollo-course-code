import { Box, Button, Checkbox, Flex, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DeleteIcon, EditIcon, TriangleDownIcon } from "@chakra-ui/icons";

function UiNotesList({ notes, onDelete, onSelect }) {
  return (
    <Stack spacing={4}>
      {notes?.map((note) => (
        <Box
          background={note.isSelected ? "#EDFDFD" : ""}
          key={note.id}
          p={2}
          h={100}
          shadow="md"
          borderWidth="3px"
        >
          <Flex h="100%" justify="space-between" marginBottom="10px">
            <Flex flex="1" h="100%" justify="space-around" direction="column">
              <Text>{note.content}</Text>
            </Flex>
          </Flex>
        </Box>
      ))}
    </Stack>
  );
}

export { UiNotesList };
