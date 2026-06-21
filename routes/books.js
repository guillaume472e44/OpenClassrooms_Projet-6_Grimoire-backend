import express from "express";
import {
  createBook,
  findAllBooks,
  findOneBook,
  findBestBooks,
  updateBook,
  deleteBook,
} from "../controllers/book.js";
import auth from "../middlewares/auth.js";
import multerConfig from "../middlewares/multer-config.js";
import sharpConfig from "../middlewares/sharp-config.js";

const router = express.Router();

router.post("/", auth, multerConfig, sharpConfig, createBook);
router.get("/bestrating", findBestBooks);
router.get("/:id", findOneBook);
router.get("/", findAllBooks);
router.put("/:id", auth, multerConfig, sharpConfig, updateBook);
router.delete("/:id", auth, deleteBook);

export default router;
