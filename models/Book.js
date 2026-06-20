import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const bookSchema = new Schema({
  userId: { type: SchemaTypes.ObjectID, ref: "User", required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: SchemaTypes.ObjectID, ref: "User", required: true },
      grade: { type: Number, required: true, min: 0, max: 5 },
    },
  ],
  averageRating: { type: Number },
});

// MongoDb va ajouter une collection "books" automatiquement
export const Book = model("Book", bookSchema);
