import { gql, useQuery } from "@apollo/client";
import { Box, Flex, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { UiNote } from "./shared-ui/UiNote";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes($categoryId: String) {
    notes(categoryId: $categoryId) {
      id
      content
      category {
        label
      }
    }
  }
`;

export function NoteList({ categoryId }) {
  const { data, loading, error } = useQuery(ALL_NOTES_QUERY, {
    variables: {
      categoryId,
    },
    errorPolicy: "all",
  });
  console.log({ data });
  if (error && !data) {
    return <Heading>Could not load notes.</Heading>;
  }
  if (loading) {
    return <Spinner />;
  }
  return (
    <Stack width={300} spacing={4}>
      {data.notes
        .filter((note) => !!note)
        .map((note) => (
          <UiNote
            key={note.id}
            category={note.category.label}
            content={note.content}
          ></UiNote>
        ))}
    </Stack>
  );
}
