import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "format invalide"],
  },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

// MongoDb va ajouter une collection "users" automatiquement
export const User = model("User", userSchema);
