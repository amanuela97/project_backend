'use strict';
import  auth from '../utils/auth.js';
import { PubSub } from 'apollo-server-express';
const pubsub = new PubSub();
const messages = [];
const subscribers = [];
const MessagesUpdated = (fun) => subscribers.push(fun);
export default {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (_, { user, content}) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        content,
        createdAt: Date.now()
      });
      //notify all subscribers
      subscribers.forEach((fun) => fun());
      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (_, args,) => {
        const channel = Math.random().toString(36).slice(2, 15);
        MessagesUpdated(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      },
    },
  },
};
