'use strict';
import {gql} from 'apollo-server-express';

// user schema
export default gql`
  extend type Query {
    getUser(id: ID!): User!
  }

  scalar Date

  type User {
    id: ID!
    username: String!
    email: String!
    public_id: String!
    url: String!
    bio: String!
    isAdmin: Boolean!
    createdAt: Date!
    updatedAt: Date!
    token: String!
  }

  extend type Mutation {
    registerUser(
      username: String!,
      password: String!,
      confirmPassword: String!,
      email: String!
      ): User!

    login(
      username: String!,
      password: String!
      ): User!

    updateUser(
      username: String!,
      email: String!,
      bio: String!,
      public_id: String!
      url: String!
      ): User!
  }
`;
