import { unlink } from "node:fs";
import { Book } from "../models/Book.js";
import isAuthorized from "../utils/auth/isAuthorized.js";

// **** **** CREATE **** ****

/**
 * Ajoute un nouveau livre
 *
 * @param {function} req - contient les données renseignées par l'utilisateur
 * @param {function} res - envoie un message de confirmation ou d'erreur
 * @param {function} next
 */
export async function createBook(req, res, next) {
  try {
    const newBook = JSON.parse(req.body.book);
    newBook.userId = req.auth.userId;
    newBook.ratings[0].userId = req.auth.userId;

    await Book.create({
      ...newBook,
      imageUrl: `${req.protocol}://${req.host}/images/${req.file.filename}`,
    });

    res.status(201).json({ message: "Livre ajouté" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error });
  }
}

// **** **** READ **** ****

/**
 * Cherche et renvoie tous les livres
 *
 * @param {function} req - non utilisé
 * @param {function} res - renvoie tous les livres de la base de donnée ou un message d'erreur
 * @param {function} next
 */
export async function findAllBooks(req, res, next) {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error });
  }
}

/**
 * Cherche et renvoie un livre grâce à son id
 *
 * @param {function} req - contient l'id renseigné en paramètre
 * @param {function} res - renvoie le livre trouvé ou un message d'erreur
 * @param {function} next
 */
export async function findOneBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error });
  }
}

/**
 * Cherche et renvoie les 3 livres les mieux notés
 *
 * @param {function} req - non utilisé
 * @param {function} res - renvoie un tableau de 3 livres
 * @param {function} next
 */
export async function findBestBooks(req, res, next) {
  try {
    const books = await Book.find().sort({ averageRating: -1 });
    const bestBooks = books.slice(0, 4);
    res.status(200).json(bestBooks);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ error });
  }
}

// **** **** UPDATE **** ****

/**
 * Mise à jour du livre
 *
 * @param {function} req - contient les données modifiées, le corps est différent si l'image est présente ou non
 * @param {function} res - envoie un message de confirmation ou d'erreur
 * @param {function} next
 */
export async function updateBook(req, res, next) {
  try {
    const bookUpdated = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.host}/images/${req.file.filename}`,
        }
      : { ...req.body };

    const bookToEdit = await Book.findById(req.params.id);

    isAuthorized(req, res, bookToEdit.userId);

    await Book.updateOne(
      { _id: req.params.id },
      { ...bookUpdated, userId: req.auth.userId },
    );

    // Suppression ancienne image, le cas échéant.
    if (req.file) {
      unlink(`images/${bookToEdit.imageUrl.split("/images/")[1]}`, (err) => {
        if (err) throw err;
        console.log("image supprimée");
      });
    }

    res.status(200).json({ message: "Livre modifié" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
}

// **** **** DELETE **** ****

/**
 * Supprime le livre grâce à son id
 *
 * @param {function} req - contient l'id renseigné en paramètre
 * @param {function} res - envoie un message de confirmation ou d'erreur
 * @param {function} next
 */
export async function deleteBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);

    isAuthorized(req, res, book.userId);

    await book.deleteOne();

    unlink(`images/${book.imageUrl.split("/images/")[1]}`, (err) => {
      if (err) throw err;
      console.log("image supprimée");
    });

    res.status(200).json({ message: "Livre supprimé" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
}
