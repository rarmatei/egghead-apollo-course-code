import {
  Box,
  Button,
  Checkbox,
  Heading,
  Text,
  Textarea,
} from "@chakra-ui/react";

function UiEditNote({ note, onSave, isSaving }) {
  function save(e) {
    e.preventDefault();
    const newContent = e.target.elements.noteContents.value;
    onSave(newContent);
  }
  if (!note) {
    return null;
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
        <Button isLoading={isSaving} type="submit" colorScheme="blue">
          Save
        </Button>
      </form>
    </Box>
  );
}

export { UiEditNote };
