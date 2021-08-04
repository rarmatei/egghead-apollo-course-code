import { gql, useQuery } from "@apollo/client";
import { UiNotesList } from "./shared-ui/UiNotesList";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes {
    notes {
      id
      content
      category {
        label
      }
    }
  }
`;

export function NoteList() {
  const { data } = useQuery(ALL_NOTES_QUERY, {
    fetchPolicy: "network-only",
  });
  return <UiNotesList notes={data?.notes}></UiNotesList>;
}
