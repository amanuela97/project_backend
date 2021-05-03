'use strict';
import {gql} from 'apollo-server-express';

// image schema
export default gql`
  type File {
    public_id: String!
    url: String!
  }

  type DeletedFile {
    result: String!
  }

  extend type Query {
    hello: String!
  }

  extend type Mutation {
    uploadFile(file: Upload!): File!
    deleteFile(public_id: String!): DeletedFile
  }

`;
