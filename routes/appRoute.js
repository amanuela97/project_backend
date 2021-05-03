'use strict';
// appRoute
import { Router } from 'express';
const router = Router();
import {users} from '../models/userModels.js';

router.get('/', (req,res) => {
  res.json(users);
});


export default router;
