import { Grid, GridItem } from "@chakra-ui/react";
import { MainNotesContainer } from "./MainNotesContainer";
import { UiAppMainHeader } from "./shared-ui/UiAppMainHeader";

function App() {
  return (
    <>
      <UiAppMainHeader />
      <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)">
        <GridItem padding="10px">
          <MainNotesContainer />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
