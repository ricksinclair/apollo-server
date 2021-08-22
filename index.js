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
    createLink: async (url) => {
      let slug = await uuid.v4().slice(0, 8);

      let results = await models.Link.findAll();
      while (results.filter((item) => item.slug === slug).length > 0) {
        slug = slug + Math.floor(Math.random() * 1000);
      }
      return models.Link.create({ url, slug });
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
