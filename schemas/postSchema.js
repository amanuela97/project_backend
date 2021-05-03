'use strict';
import {gql} from 'apollo-server-express';

// post schema
export default gql`
  type Query {
    getPosts: [Post]
    getPaginatedPosts(limit: Int = 3, page: Int!, sort: String!): [PostPaginated]
    getPost(postId: ID!): Post
    getUserPaginatedPosts(limit: Int = 3, page: Int!, sort: String!): [PostPaginated]
  }


  type Comment {
    id: ID!
    body: String!
    username: String!
    userID: String!
    createdAt: Date!
  }

  type Like {
    id: ID!
    username: String!
    createdAt: Date!
  }

  type Post {
    id: ID!
    title: String!
    description: String!
    username: String!
    user: ID!
    hidden: Boolean!
    body: Body
    comments: [Comment]!
    likes: [Like]!
    createdAt: Date
    updatedAt: Date
    likeCount: Int!
    commentCount: Int!
  }

  type PostPaginated {
    id: ID!
    title: String!
    description: String!
    username: String!
    hidden: Boolean!
    body: Body
    comments: [Comment]!
    likes: [Like]!
    user: ID!
    createdAt: Date
    updatedAt: Date
    likes_count: Int!
    comments_count: Int!
    pageCount: Int!
  }

  type Body {
    public_id: String!
    url: String!
  }

  type Mutation {
    createPost(title: String!, body: String!, description: String!, hidden: Boolean!): Post!
    updatePost(postId: ID!, title: String!, description: String!, hidden: Boolean!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

`;

