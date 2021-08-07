import { Box, Flex, Text } from "@chakra-ui/react";

export function UiNote({ isSelected, content, category, children }) {
  return (
    <Box
      background={isSelected ? "#EDFDFD" : ""}
      p={2}
      shadow="md"
      height={100}
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
        <Flex justify="space-around" height="100%" direction="column">
          {children}
        </Flex>
      </Flex>
    </Box>
  );
}
