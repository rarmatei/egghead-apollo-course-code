import { gql, useQuery } from "@apollo/client";
import { UiNotesList } from "./shared-ui/UiNotesList";
import { Spinner } from "@chakra-ui/react";

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
  const { data, loading } = useQuery(ALL_NOTES_QUERY, {
    variables: {
      categoryId,
    },
  });
  if (loading) {
    return <Spinner />;
  }
  return <UiNotesList notes={data?.notes}></UiNotesList>;
}
