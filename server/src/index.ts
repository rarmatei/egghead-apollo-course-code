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
  { id: "1", content: "Shopping list item: 🍋 Lemons", categoryId: "1" },
  { id: "2", content: "Shopping list item:  🥑 Avocados", categoryId: "1" },
  {
    id: "9",
    content:
      "✈️ Italy trip ideas: A day in Milan opens up a grand Gothic Duomo (cathedral), Leonardo Da Vinci's Last Supper and world-class opera at La Scala. A short train ride away, belle époque Lake Maggiore harbours the beguiling Borromean Islands...",
    categoryId: "3",
  },
  {
    id: "10",
    content: "Book Italy flight.",
    categoryId: "3",
  },
  {
    id: "11",
    content: "Book return flights.",
    categoryId: "3",
  },
  {
    id: "14",
    content:
      "🍾 Ideas for wedding venues: Set within the beautiful surroundings of Bellahouston Park, House for an Art Lover is a truly unique wedding venue in Glasgow. Their exclusive-use Mackintosh Suite is inspired by Scotland’s most beloved artist, Charles Rennie Mackintosh, and is full of photo-worthy spots. ",
    categoryId: "1",
  },
  { id: "3", content: "Shopping list item:  131231313212", categoryId: "1" },
  { id: "4", content: "Shopping list item:  dadad", categoryId: "1" },
  { id: "5", content: "Shopping list item:  adadads", categoryId: "1" },
  { id: "6", content: "Shopping list item:  asdadad", categoryId: "1" },
  { id: "7", content: "Shopping list item:  gsfgsfgsfgsfgs", categoryId: "1" },
];

const resolvers = {
  Note: {
    category: (parent) => {
      // if (parent.id === "14") {
      //   throw new Error(`Could not retrieve note with ID ${parent.id}`);
      // }
      return categories.find((category) => category.id === parent.categoryId);
    },
  },
  Query: {
    notes: (root, args, context) => {
      if (!args.categoryId) {
        return allNotes;
      }
      const categorisedNotes = args.categoryId
        ? allNotes.filter((note) => note.categoryId === args.categoryId)
        : allNotes;
      if (args.offset !== undefined && args.offset !== null && args.limit) {
        return categorisedNotes.slice(args.offset, args.offset + args.limit);
      }
      return categorisedNotes;
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
      if (noteId === "14") {
        throw new Error("Cannot delete note with ID 14");
      }
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

//For polling lesson
// setTimeout(() => {
//   categories.push({
//     id: "4",
//     label: "👶 Childcare",
//   });
// }, 8000);
//
// setTimeout(() => {
//   categories.push({
//     id: "5",
//     label: "💻 Work",
//   });
// }, 12000);

// For subscription lesson
setInterval(() => {
  if (unpublishedSharedNotes.length === 0) {
    return;
  }
  const newNote = unpublishedSharedNotes.shift();
  allNotes.unshift(newNote);
  pubsub.publish("NEW_SHARED_NOTE", {
    newSharedNote: newNote,
  });
}, 8000);

(async function () {
  const app = express();
  app.use(cors());
  const restRouter = express.Router();

  restRouter.get("/notes", (req, res, next) => {
    const categoryId = req.query["categoryId"];
    const offset = parseInt(req.query["offset"]);
    const limit = parseInt(req.query["limit"]);
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
