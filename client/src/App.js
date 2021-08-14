import { Box, Flex } from "@chakra-ui/react";
import { MainNotesContainer } from "./MainNotesContainer";
import { UiAppMainHeader } from "./shared-ui/UiAppMainHeader";
import { Route } from "react-router-dom";
import { EditNote } from "./EditNote";

function App() {
  return (
    <>
      <UiAppMainHeader />
      <Flex padding="10px" alignItems="flex-start">
        <Box>
          <MainNotesContainer />
        </Box>
        <Box paddingLeft="30px" width="450px">
          <Route path={`/note/:noteId`}>
            <EditNote />
          </Route>
        </Box>
      </Flex>
    </>
  );
}

export default App;
