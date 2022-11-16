'use strict';
import { ApolloServer} from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import {checkAuth} from './passport/authenticate.js';
import typeDefs from './schemas/index.js';
import resolvers from './resolvers/index.js';
import db from './db/db.js';
import dotenv from 'dotenv';
import production from './security/production.js';
import helmet from "helmet";

dotenv.config();
const port = process.env.PORT || 4000;
const app = express();
app.use(helmet.hidePoweredBy());
(async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({req, res}) => {
        if (req) {
          const user = await checkAuth(req, res);
          return {
            req,
            res,
            user,
          };
        }
      },
    });

    app.use(cors());
    app.use(express.json()); // for parsing application/json
    app.use(express.urlencoded({extended: true}));// for parsing application/x-www-form-urlencoded

    server.applyMiddleware({app});


    db.on('connected', () => {
         production(app, port);
    });

  } catch (e) {
     console.log('server error: ' + e.message);
  }
})();



