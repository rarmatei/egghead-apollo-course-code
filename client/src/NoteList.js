import { gql, useMutation, useQuery } from "@apollo/client";
import { Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { UiNote } from "./shared-ui/UiNote";
import { ViewNoteButton } from "./shared-ui/ViewButton";
import { Link } from "react-router-dom";
import { DeleteButton } from "./shared-ui/DeleteButton";

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

const DELETE_NOTE_MUTATION = gql`
  mutation DeleteNote($noteId: String!) {
    deleteNote(id: $noteId) {
      successful
      note {
        id
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

  const [deleteNote] = useMutation(DELETE_NOTE_MUTATION, {
    refetchQueries: ["GetAllNotes"],
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
            <DeleteButton
              onClick={() => deleteNote({ variables: { noteId: note.id } })}
            />
          </UiNote>
        ))}
    </Stack>
  );
}
