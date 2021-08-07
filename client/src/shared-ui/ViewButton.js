import { EditIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

export function ViewNoteButton() {
  return (
    <Button size="xs" colorScheme="blue" leftIcon={<EditIcon />}>
      View
    </Button>
  );
}
