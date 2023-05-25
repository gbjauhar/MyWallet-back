import express from 'express';
import { postUser } from '../controllers/signUp.controller.js';
import { validateSignUp } from '../middlewares/signUpMiddleware.js';

const router = express.Router();

router.post("/signup", validateSignUp, postUser)

export default router;
