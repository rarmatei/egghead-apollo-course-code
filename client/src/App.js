import { Flex, Grid, GridItem, Heading, Image } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import { EditNote } from "./EditNote";
import { MainNotesContainer } from "./MainNotesContainer";

function App() {
  return (
    <>
      <Flex width="270px" justify="space-between" padding="10px" align="center">
        <Image
          boxSize="50px"
          objectFit="cover"
          src="/apollo-graphql-compact.svg"
          alt="Segun Adebayo"
        />
        <Heading fontSize="2rem">Apollo Notes</Heading>
      </Flex>

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
