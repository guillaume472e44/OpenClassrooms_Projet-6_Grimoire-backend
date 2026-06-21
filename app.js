import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import connectToDB from "./utils/db/mongoDBConnection.js";
import usersRoutes from "./routes/users.js";
import booksRoutes from "./routes/books.js";
import cors from "./utils/CORS/cors.js";

async function startServer() {
  try {
    // Connection à MongoDB
    await connectToDB();

    const app = express();
    const PORT = process.env.PORT || 4000;
    // __dirname is not defined in ES module scope
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    // Analyse les requêtes JSON entrantes et place les données analysées dans req.body.
    app.use(express.json());

    // CORS Configuration. Permet au frontend de communiquer avec ce backend.
    app.use(cors);

    // Routes API
    app.use("/api/auth", usersRoutes);
    app.use("/api/books", booksRoutes);
    app.use("/images", express.static(path.join(__dirname, "images")));

    // Démarre le serveur Express
    app.listen(PORT, () => {
      console.log(`serveur démarré sur port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);

    // Quitte le processus si le démarage échoue.
    // Garantit que l'application ne s'exécute pas dans un état défectueux.
    process.exit(1);
  }
}

startServer();
