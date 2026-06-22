import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connexion à MongoDB réussie");
  } catch (error) {
    console.error(error.message);
    throw new Error("la connexion à mongoDB a échouée");
  }
};
