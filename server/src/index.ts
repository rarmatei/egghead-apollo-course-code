const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub, withFilter } from "graphql-subscriptions";
import * as cors from "cors";

const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    categories: [Category]
    notes(categoryId: String, offset: Int, limit: Int): [Note]
    note(id: String!): Note
  }
  type Category {
    id: String!
    label: String!
  }
  type Note {
    id: String!
    content: String!
    category: Category!
  }
  type UpdateNoteResponse {
    note: Note
    successful: Boolean!
  }
  type DeleteNoteResponse {
    successful: Boolean!
    note: Note!
  }
  type Mutation {
    updateNote(id: String!, content: String!): UpdateNoteResponse
    deleteNote(id: String!): DeleteNoteResponse
    updateCategory(id: String!, label: String!): Category
  }
  type Subscription {
    newSharedNote(categoryId: String): Note!
  }
`;

let categories = [
  { id: "1", label: "🛒 Shopping" },
  { id: "2", label: "💭 Random thoughts" },
  { id: "3", label: "✈️ Holiday Planning" },
];

let allNotes = [
  { id: "1", content: "🍋 Lemons", categoryId: "1" },
  { id: "2", content: "🥑 Avocados", categoryId: "1" },
  { id: "3", content: "🍌 Bananas", categoryId: "1" },
  { id: "4", content: "🥥 Coconut water", categoryId: "1" },
  { id: "5", content: "🍞 Bread", categoryId: "1" },
  { id: "6", content: "🍎 Apples", categoryId: "1" },
  { id: "7", content: "Walnuts", categoryId: "1" },
  { id: "8", content: "Oats", categoryId: "1" },
  {
    id: "9",
    content: "Book Italy flight.",
    categoryId: "3",
  },
  {
    id: "10",
    content:
      "The first person who inhaled helium must have been so relieved when the effects wore off",
    categoryId: "2",
  },
];

const resolvers = {
  Note: {
    category: (parent) => {
      // for error handling lesson
      // if (parent.id === "2") {
      //   throw new Error(`Could not retrieve note with ID ${parent.id}`);
      // }
      return categories.find((category) => category.id === parent.categoryId);
    },
  },
  Query: {
    notes: (root, args, context) => {
      if (!args.categoryId && !args.offset && !args.limit) {
        return allNotes;
      }
      const categorisedNotes = args.categoryId
        ? allNotes.filter((note) => note.categoryId === args.categoryId)
        : allNotes;
      return categorisedNotes.slice(args.offset, args.offset + args.limit);
    },
    note: (root, args, context) => {
      const noteId = args.id;
      return allNotes.find((note) => note.id === noteId);
    },
    categories: () => categories,
  },
  Mutation: {
    updateNote: (root, args, context) => {
      const noteId = args.id;
      allNotes = allNotes.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            content: args.content,
          };
        }
        return note;
      });
      return {
        note: allNotes.find((note) => note.id === noteId),
        successful: true,
      };
    },
    deleteNote: (root, args, context) => {
      const noteId = args.id;
      const deletedNote = allNotes.find((note) => note.id === noteId);
      allNotes = allNotes.filter((n) => n.id !== noteId);
      return {
        successful: true,
        note: deletedNote,
      };
    },
    updateCategory: (root, args, context) => {
      const categoryId = args.id;
      categories = categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            label: args.label,
          };
        }
        return category;
      });
      return categories.find((note) => note.id === categoryId);
    },
  },
  Subscription: {
    newSharedNote: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_SHARED_NOTE"]),
        (payload, variables) => {
          if (!variables.categoryId) {
            return true;
          }
          return payload.newSharedNote.categoryId === variables.categoryId;
        }
      ),
    },
  },
};

let unpublishedSharedNotes = [
  {
    id: "11",
    content: "From Kate - Christmas shopping list: tree 🎄",
    categoryId: "1",
  },
  {
    id: "12",
    content: "From Rick - homework for tomorrow: maths, physics",
    categoryId: "1",
  },
  {
    id: "13",
    content: "From Rares - Apollo course lesson 1 draft",
    categoryId: "2",
  },
  {
    id: "14",
    content: "From Tom - Adding some venues we can book for the wedding...",
    categoryId: "1",
  },
  {
    id: "15",
    content: "From Shirley - This is the poem I wrote for tomorrow...",
    categoryId: "2",
  },
  {
    id: "16",
    content: "From Troy - Spanish project with Abed",
    categoryId: "3",
  },
];

// For subscription lesson
// setInterval(() => {
//   if (unpublishedSharedNotes.length === 0) {
//     return;
//   }
//   const newNote = unpublishedSharedNotes.shift();
//   allNotes.unshift(newNote);
//   pubsub.publish("NEW_SHARED_NOTE", {
//     newSharedNote: newNote,
//   });
// }, 8000);

(async function () {
  const app = express();
  app.use(cors());
  const restRouter = express.Router();

  restRouter.get("/notes", (req, res, next) => {
    const categoryId = req.query["categoryId"];
    const offset = req.query["offset"];
    const limit = req.query["limit"];
    const categorisedNotes = categoryId
      ? allNotes.filter((note) => note.categoryId === categoryId)
      : allNotes;
    const notes = categorisedNotes
      .slice(offset, offset + limit)
      .map((note) => ({
        id: note.id,
        content: note.content,
        category: categories.find((c) => c.id === note.categoryId),
      }));
    res.send(notes);
  });

  restRouter.delete("/notes/:noteId", (req, res, next) => {
    const noteId = req.params.noteId;
    const deletedNote = allNotes.find((note) => note.id === noteId);
    allNotes = allNotes.filter((n) => n.id !== noteId);
    res.send({
      successful: true,
      note: deletedNote,
    });
  });

  app.use("/rest-api", restRouter);

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
