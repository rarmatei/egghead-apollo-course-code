import { Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

function UiEditCategoriesButton({ onClick }) {
  return (
    <Button marginLeft={5} flex={1} leftIcon={<EditIcon />} onClick={onClick}>
      Edit Categories
    </Button>
  );
}

export { UiEditCategoriesButton };
