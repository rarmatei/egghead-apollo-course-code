import { gql, useQuery } from "@apollo/client";
import { UiNotesList } from "./shared-ui/UiNotesList";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes {
    notes {
      content
      category {
        label
      }
    }
  }
`;

function NoteList() {
  const { data } = useQuery(ALL_NOTES_QUERY);
  return <UiNotesList notes={data?.notes}></UiNotesList>;
}

export { NoteList };
