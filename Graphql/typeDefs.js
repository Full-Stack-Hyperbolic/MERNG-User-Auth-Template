const { gql } = require('apollo-server');

module.exports = gql`
  """
  A Post created by Users containing: [id, body, createdAt, username]
  """
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }

  """
  User object returned from Mutations: [register, login]
  """
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  """
  Stores input for registration of new User including: [username, password, confirmPassword, email]
  """
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  """
  Queries containing: [getPosts, getAllUsers] results
  """
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getAllUsers: [User]
  }

  """
  Mutations containing: [register, login, createPost] actions
  """
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
  }
`;
