import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { RetryLink } from "@apollo/client/link/retry";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const retryLink = new RetryLink({
  delay: {
    initial: 2000,
    max: 2000,
    jitter: false,
  },
});

const selectedNoteIds = makeVar([]);

export function toggleNote(noteId, isSelected) {
  if (isSelected) {
    selectedNoteIds([...selectedNoteIds(), noteId]);
  } else {
    selectedNoteIds(
      selectedNoteIds().filter((selectedNoteId) => selectedNoteId !== noteId)
    );
  }
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        notes: {
          keyArgs: ["categoryId"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Note: {
      fields: {
        isSelected: {
          read(currentIsSelectedValue, helpers) {
            const currentNoteId = helpers.readField("id");
            return selectedNoteIds().includes(currentNoteId);
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  cache,
  link: from([retryLink, httpLink]),
});
ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
