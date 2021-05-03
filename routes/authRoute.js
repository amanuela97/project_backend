'use strict';
// authRoute
import { Router } from 'express';
const router = Router();
import { login, register } from '../controllers/authController';

//login
router.route('/login').
get((req,res)=>{
  res.send('this will be the login page')
}).
post(login);

//register
router.route('/register').
get((req,res)=>{
  res.send('this will be the register page')
}).
post(register);

export default router;
