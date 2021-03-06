const postsResolvers = require('./posts.js');
const usersResolvers = require('./users.js');

module.exports = {
  Query: {
    ...postsResolvers.Query,
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};
