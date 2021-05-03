'use strict';
import {AuthenticationError} from 'apollo-server-express';

const Authenticated = (user) => {
  if (!user) {
    throw new AuthenticationError("You are not authenticated!");
  }
}

export default Authenticated;
