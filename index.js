const { ApolloServer, gql } = require("apollo-server");
const models = require("./models");
const uuid = require("uuid");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    links: [Link]
  }
  type Link {
    link: String!
    slug: String!
  }
  type Mutation {
    createLink(url: String!): Link
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    links: async (root, args, { models }) => {
      return models.Link.findAll();
    }
  },

  Link: {
    link: async (link) => link.link,
    slug: async (link) => link.slug
  },

  Mutation: {
    createLink: async (link) => {
      let slug = uuid.v5(link, uuid.v5.URL).slice(0, 8);
      while (
        models.Link.findAll().filter((item) => item.slug === slug).length > 0
      ) {
        slug = slug + Math.floor(Math.random() * 1000);
      }
      return models.Link.create({ link, slug });
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
