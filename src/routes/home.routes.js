import express from 'express';
import { deleteHome, getHome, updateHome } from '../controllers/home.controllers.js';

const router = express.Router();

router.delete("/home/:id", deleteHome)
router.get("/home", getHome)
router.put("/home/:id", updateHome)

export default router;
