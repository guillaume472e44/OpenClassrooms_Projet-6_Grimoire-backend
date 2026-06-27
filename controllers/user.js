import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

/**
 * Permet d'ajouter un nouvel utilisateur
 * mot de passe hashé avec bcrypt
 *
 * @param {Object} req - contient le mot de passe non crypté
 * @param {Object} res - envoie un message de confirmation ou d'erreur
 * @param {function} next
 */
export async function signup(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    console.error(error.message);
    res.status(error.name === "ValidationError" ? 400 : 500).json({ error });
  }
}

/**
 *
 * @param {Object} req - contient l'email et le mot de passe
 * @param {Object} res - envoie un token web JSON et l'_id utilisateur
 * @param {function} next
 */
export async function login(req, res, next) {
  try {
    // Vérif présence email dans la base de donnée
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw Error("Paire id/mdp incorrect");

    // Vérif correspondance mot de passe
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isValidPassword) throw Error("Paire id/mdp incorrect");

    // renvoie l’_id de l'utilisateur depuis la base de données
    // et un token web JSON signé (contenant également l'_id de l'utilisateur).
    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(error.message === "Paire id/mdp incorrect" ? 401 : 500)
      .json({ error });
  }
}
