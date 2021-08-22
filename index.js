const { ApolloServer, gql } = require("apollo-server");
const Sequelize = require("sequelize");
const models = require("./models");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    links: [Link]
  }
  type Link {
    id: ID!
    link: String!
    slug: String!
  }
  type Mutation {
    createLink(id: Int!, url: String!): Link
    deleteLink(id: Int!): Boolean
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => "Hello world!"
  },

  Link: {
    link: () => "",
    slug: () => ""
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
