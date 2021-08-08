import { gql, useMutation, useQuery } from "@apollo/client";
import { Checkbox, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import { UiNote } from "./shared-ui/UiNote";
import { ViewNoteButton } from "./shared-ui/ViewButton";
import { Link } from "react-router-dom";
import { DeleteButton } from "./shared-ui/DeleteButton";
import { UiLoadMoreButton } from "./shared-ui/UiLoadMoreButton";
import { toggleNote } from "./index";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes($categoryId: String, $offset: Int, $limit: Int) {
    notes(categoryId: $categoryId, offset: $offset, limit: $limit) {
      id
      content
      isSelected @client
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
  const { data, loading, error, fetchMore } = useQuery(ALL_NOTES_QUERY, {
    variables: {
      categoryId,
      offset: 0,
      limit: 3,
    },
    errorPolicy: "all",
  });

  const [deleteNote] = useMutation(DELETE_NOTE_MUTATION, {
    // refetchQueries: ["GetAllNotes"],
    optimisticResponse: (vars) => {
      return {
        optimistic: true,
        deleteNote: {
          __typename: "DeleteNoteResponse",
          successful: true,
          note: {
            id: vars.noteId,
            __typename: "Note",
          },
        },
      };
    },
    update(cache, element) {
      const deletedNoteIdentifier = cache.identify(
        element.data?.deleteNote.note
      );
      cache.modify({
        fields: {
          notes(existingNotes) {
            return existingNotes.filter(
              (note) => deletedNoteIdentifier !== cache.identify(note)
            );
          },
        },
      });
      if (!element.data.optimistic) {
        cache.evict({ id: deletedNoteIdentifier });
      }
    },
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
            <Checkbox
              onChange={(e) => toggleNote(note.id, e.target.checked)}
              isChecked={note.isSelected}
            >
              Select
            </Checkbox>
            <Link to={`/note/${note.id}`}>
              <ViewNoteButton />
            </Link>
            <DeleteButton
              onClick={() =>
                deleteNote({ variables: { noteId: note.id } }).catch((e) =>
                  console.error(e)
                )
              }
            />
          </UiNote>
        ))}
      <UiLoadMoreButton
        onClick={() => fetchMore({ variables: { offset: data.notes.length } })}
      />
    </Stack>
  );
}
