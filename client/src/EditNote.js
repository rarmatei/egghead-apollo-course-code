import { useParams } from "react-router-dom";
import { UiEditNote } from "./shared-ui/UiEditNote";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Spinner } from "@chakra-ui/react";

export function EditNote() {
  let { noteId } = useParams();

  const { data, loading } = useQuery(
    gql`
      query EditNote($id: String!) {
        note(id: $id) {
          id
          content
        }
      }
    `,
    {
      variables: { id: noteId },
    }
  );

  const [updateNote, { loading: noteSaving }] = useMutation(
    gql`
      mutation UpdateNote($id: String!, $content: String!) {
        updateNote(id: $id, content: $content) {
          successful
        }
      }
    `
  );

  if (loading) {
    return <Spinner />;
  }
  return (
    <UiEditNote
      note={data.note}
      isSaving={noteSaving}
      onSave={(content) => updateNote({ variables: { content, id: noteId } })}
    />
  );
}