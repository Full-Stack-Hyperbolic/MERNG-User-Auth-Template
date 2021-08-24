// Dependency imports
const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

// Server connections
const port = process.env.PORT || 5000;
const { MONGODB } = require('./config');

// Local imports
const typeDefs = require('./Graphql/typeDefs');
const resolvers = require('./Graphql/resolvers/index.js');

// Server creation
const server = new ApolloServer({ typeDefs, resolvers });

mongoose
  .connect(MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('MongoDb Successfully Connected');
    return server.listen(port);
  })
  .then(() => {
    console.log(`Server sucessfully stared on port ${port}`);
  });
