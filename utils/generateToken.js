'user strict';
import jwt from 'jsonwebtoken';

const generateToken = (id,email,username) => {
  return jwt.sign(
    {
      id: id,
      email: email,
      username: username
    },
    process.env.ACCESS_TOKEN_SECRET,
  );
}


export default generateToken;
