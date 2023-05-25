import express from 'express';
import { deleteHome, getHome } from '../controllers/home.controllers.js';

const router = express.Router();

router.delete("/home/:id", deleteHome)
router.get("/home", getHome)

export default router;
