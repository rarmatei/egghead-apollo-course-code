import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  Checkbox,
  Divider,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { UiNote } from "./shared-ui/UiNote";
import { ViewNoteButton } from "./shared-ui/ViewButton";
import { Link } from "react-router-dom";
import { DeleteButton } from "./shared-ui/DeleteButton";
import { UiLoadMoreButton } from "./shared-ui/UiLoadMoreButton";
import { toggleNote } from "./index";

const REST_ALL_NOTES_QUERY = gql`
  query GetAllNotes($categoryId: String, $offset: Int, $limit: Int) {
    notes(categoryId: $categoryId, offset: $offset, limit: $limit)
      @rest(
        type: "Note"
        path: "/notes?categoryId={args.categoryId}&offset={args.offset}&limit={args.limit}"
      ) {
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

const REST_DELETE_NOTE_MUTATION = gql`
  mutation DeleteNote($noteId: String!) {
    deleteNote(id: $noteId)
      @rest(
        type: "DeleteNoteResponse"
        path: "/notes/{args.id}"
        method: "DELETE"
      ) {
      successful
      note @type(name: "Note") {
        id
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

  const { data: newNoteData } = useSubscription(gql`
    subscription NewSharedNote($categoryId: String) {
      newSharedNote(categoryId: $categoryId) {
        id
        content
        category {
          id
          label
        }
      }
    }
  `);
  const newNote = newNoteData?.newSharedNote;
  let recentChanges = null;
  if (newNote) {
    recentChanges = (
      <>
        <Text>Recent changes: </Text>
        <UiNote
          category={newNote.category.label}
          content={newNote.content}
        ></UiNote>
        <Divider />
      </>
    );
  }

  if (error && !data) {
    return <Heading>Could not load notes.</Heading>;
  }
  if (loading) {
    return <Spinner />;
  }
  return (
    <Stack spacing={4}>
      {recentChanges}
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
