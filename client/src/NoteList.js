import { gql, useQuery } from "@apollo/client";
import { UiNotesList } from "./shared-ui/UiNotesList";

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
  const { data } = useQuery(ALL_NOTES_QUERY, {
    variables: {
      categoryId,
    },
  });
  return <UiNotesList notes={data?.notes}></UiNotesList>;
}
