import { gql, useQuery } from "@apollo/client";
import { Stack } from "@chakra-ui/react";
import { UiNotesList } from "./shared-ui/UiNotesList";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes {
    notes {
      id
      content
    }
  }
`;

function NoteList() {
  const { data } = useQuery(ALL_NOTES_QUERY);
  console.log({ data });
  return (
    <Stack>
      <UiNotesList notes={data?.notes}></UiNotesList>
    </Stack>
  );
}

export { NoteList };
