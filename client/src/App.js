import { MainNotesContainer } from "./MainNotesContainer";
import { Route } from "react-router-dom";
import { EditNote } from "./EditNote";
import { UiAppLayout } from "./shared-ui/UiAppLayout";

function App() {
  return (
    <UiAppLayout>
      <MainNotesContainer />
      <Route path={`/note/:noteId`}>
        <EditNote />
      </Route>
    </UiAppLayout>
  );
}

export default App;
