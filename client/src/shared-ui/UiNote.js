import { Box, Flex, Text } from "@chakra-ui/react";

export function UiNote({ isSelected, content, category }) {
  return (
    <Box
      background={isSelected ? "#EDFDFD" : ""}
      p={2}
      shadow="md"
      borderWidth="3px"
    >
      <Flex h="100%" justify="space-between" marginBottom="10px">
        <Flex flex="1" h="100%" justify="space-around" direction="column">
          <Text>{content}</Text>
          {category && (
            <Flex>
              <Text fontWeight="bold" marginRight={2}>
                Category:{" "}
              </Text>{" "}
              <Text>{category}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
