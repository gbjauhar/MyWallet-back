import express from 'express';
import { postExpense } from '../controllers/expense.controller.js';
import { validateEntry } from '../middlewares/entryMiddleware.js';

const router = express.Router();

router.post("/expense", validateEntry, postExpense)

export default router;
