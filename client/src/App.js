import { Grid, GridItem } from "@chakra-ui/react";
import { MainNotesContainer } from "./MainNotesContainer";
import { UiAppMainHeader } from "./shared-ui/UiAppMainHeader";
import { Route } from "react-router-dom";
import { EditNote } from "./EditNote";

function App() {
  return (
    <>
      <UiAppMainHeader />
      <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)">
        <GridItem padding="10px">
          <MainNotesContainer />
        </GridItem>
        <GridItem padding="10px">
          <Route path={`/note/:noteId`}>
            <EditNote />
          </Route>
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
