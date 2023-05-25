import express from 'express';
import { postIncome } from '../controllers/income.controller.js';
import { validateEntry } from '../middlewares/entryMiddleware.js';

const router = express.Router();

router.post("/income", validateEntry, postIncome)

export default router;
