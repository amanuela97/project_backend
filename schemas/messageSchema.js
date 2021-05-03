'use strict';
import {gql} from 'apollo-server-express';

// message schema
export default gql`
  type Message {
    id: ID!
    user: String!
    content: String!
    createdAt: Date!
  }
  extend type Query {
    messages: [Message!]
  }
  extend type Mutation {
    postMessage(user: String!, content: String!): ID!
  }
  type Subscription {
    messages: [Message!]
  }

`;
