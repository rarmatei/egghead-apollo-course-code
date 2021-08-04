import {
  Box,
  Button,
  Checkbox,
  Heading,
  Text,
  Textarea,
} from "@chakra-ui/react";

function UiEditNote({ note, onSave }) {
  function save(e) {
    e.preventDefault();
    const newContent = e.target.elements.noteContents.value;
    onSave(newContent);
  }
  return (
    <Box
      background={note.isSelected ? "#EDFDFD" : ""}
      p={5}
      shadow="md"
      borderWidth="1px"
    >
      <Heading marginBottom={5} fontSize="1.5rem" as="h1">
        Editing note with ID {note.id}
      </Heading>
      <form onSubmit={save}>
        <Textarea key={note.id} id="noteContents" defaultValue={note.content} />
        <Text padding="10px 0">Selected: {note.isSelected ? "yes" : "no"}</Text>
        <Button type="submit" colorScheme="blue">
          Save
        </Button>
      </form>
    </Box>
  );
}

export { UiEditNote };
