import express from 'express';
import { postExpense } from './Controllers/expenseController.js';
import { deleteHome, getHome } from './Controllers/homeControllers.js';
import { postIncome } from './Controllers/incomeController.js';
import { postLogin } from './Controllers/loginController.js';
import { getUser, postUser } from './Controllers/signUp.controller.js';
import { validateEntry } from './Middlewares/entryMiddleware.js';
import { validateSignUp } from './Middlewares/signUpMiddleware.js';

const router = express.Router();

router.post("/signup", validateSignUp, postUser)
router.post("/", postLogin)
router.post("/income", validateEntry, postIncome)
router.get("/signup", getUser)
router.post("/expense", validateEntry, postExpense)
router.delete("/home/:id", deleteHome)
router.get("/home", getHome)

export default router;