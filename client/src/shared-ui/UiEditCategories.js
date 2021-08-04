import { Box, Button, Flex, Input } from "@chakra-ui/react";

function UiEditCategories({ categories, onEditCategory }) {
  function saveCategory(e, id) {
    e.preventDefault();
    const label = e.target.elements.categoryLabel.value;
    onEditCategory({ id, label });
  }
  return (
    <Box padding="10px">
      {categories.map((category) => (
        <form key={category.id} onSubmit={(e) => saveCategory(e, category.id)}>
          <Flex marginBottom="10px">
            <Input
              id="categoryLabel"
              background="white"
              defaultValue={category.label}
            ></Input>
            <Button type="submit" marginLeft="5px">
              Save
            </Button>
          </Flex>
        </form>
      ))}
    </Box>
  );
}

export { UiEditCategories };
