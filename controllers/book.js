import { unlink } from "node:fs";
import { Book } from "../models/Book.js";
import isAuthorized from "../utils/auth/isAuthorized.js";
import findBooks from "../utils/books/findBooks.js";

// **** **** CREATE **** ****

/**
 * Ajoute un nouveau livre
 *
 * @param {Object} req - contient les données renseignées par l'utilisateur
 * @param {Object} res - envoie un message de confirmation ou d'erreur
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

/**
 * Ajoute la note d'un utilisateur et met à jour la note moyenne du livre
 *
 * @param {Object} req - contient l'id du livre, userId et note de l'utilisateur
 * @param {Object} res - renvoie le livre mis à jour (ajout note et calcul de la moyenne)
 * @param {function} next
 */
export async function postRating(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);

    const hasUserAlreadyVoted = book.ratings.find(
      (grade) => grade.userId === req.auth.userId,
    );
    if (hasUserAlreadyVoted) throw Error("Impossible de voter plusieurs fois");

    book.ratings = [
      ...book.ratings,
      { userId: req.auth.userId, grade: req.body.rating },
    ];

    const average =
      book.ratings.reduce((acc, curr) => acc + curr.grade, 0) /
      book.ratings.length;
    book.averageRating = Number.isInteger(average)
      ? average
      : average.toFixed(1);

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error });
  }
}

// **** **** READ **** ****

/**
 * Cherche et renvoie tous les livres
 *
 * @param {Object} req - non utilisé
 * @param {Object} res - renvoie tous les livres de la base de donnée ou un message d'erreur
 * @param {function} next
 */
export async function findAllBooks(req, res, next) {
  findBooks(req, res, "all");
}

/**
 * Cherche et renvoie un livre grâce à son id
 *
 * @param {Object} req - contient l'id renseigné en paramètre
 * @param {Object} res - renvoie le livre trouvé ou un message d'erreur
 * @param {function} next
 */
export async function findOneBook(req, res, next) {
  findBooks(req, res, "one");
}

/**
 * Cherche et renvoie les 3 livres les mieux notés
 *
 * @param {Object} req - non utilisé
 * @param {Object} res - renvoie un tableau de 3 livres
 * @param {function} next
 */
export async function findBestBooks(req, res, next) {
  findBooks(req, res, "best");
}

// **** **** UPDATE **** ****

/**
 * Mise à jour du livre
 *
 * @param {Object} req - contient les données modifiées, le corps est différent si l'image est présente ou non
 * @param {Object} res - envoie un message de confirmation ou d'erreur
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
 * @param {Object} req - contient l'id renseigné en paramètre
 * @param {Object} res - envoie un message de confirmation ou d'erreur
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
