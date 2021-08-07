import { gql, useQuery } from "@apollo/client";
import { Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { UiNote } from "./shared-ui/UiNote";
import { ViewNoteButton } from "./shared-ui/ViewButton";
import { Link } from "react-router-dom";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes($categoryId: String) {
    notes(categoryId: $categoryId) {
      id
      content
      category {
        id
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
  if (error && !data) {
    return <Heading>Could not load notes.</Heading>;
  }
  if (loading) {
    return <Spinner />;
  }
  return (
    <Stack spacing={4}>
      {data.notes
        .filter((note) => !!note)
        .map((note) => (
          <UiNote
            key={note.id}
            category={note.category.label}
            content={note.content}
          >
            <Link to={`/note/${note.id}`}>
              <ViewNoteButton />
            </Link>
          </UiNote>
        ))}
    </Stack>
  );
}
