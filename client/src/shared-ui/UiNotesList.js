import { Box, Button, Checkbox, Flex, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DeleteIcon, EditIcon, TriangleDownIcon } from "@chakra-ui/icons";

function UiNotesList({ notes, onDelete, onSelect }) {
  return (
    <Stack width={300} spacing={4}>
      {notes?.map((note) => (
        <Box
          background={note.isSelected ? "#EDFDFD" : ""}
          key={note.id}
          p={2}
          shadow="md"
          borderWidth="3px"
        >
          <Flex h="100%" justify="space-between" marginBottom="10px">
            <Flex flex="1" h="100%" justify="space-around" direction="column">
              <Text>{note.content}</Text>
              {note.category && (
                <Flex>
                  <Text fontWeight="bold" marginRight={2}>
                    Category:{" "}
                  </Text>{" "}
                  <Text>{note.category.label}</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Box>
      ))}
    </Stack>
  );
}

export { UiNotesList };
