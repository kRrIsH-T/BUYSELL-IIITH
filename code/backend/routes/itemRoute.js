import express from "express";
import { getItems, createItem, getItemById } from "../controllers/itemController.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", createItem);
router.get('/:id', getItemById);
export default router;