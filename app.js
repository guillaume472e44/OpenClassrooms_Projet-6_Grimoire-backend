import "dotenv/config";
import express from "express";
import connectToDB from "./utils/db/mongoDBConnection.js";

async function startServer() {
  try {
    // Connection à MongoDB
    await connectToDB();

    const app = express();
    const PORT = process.env.PORT || 4000;

    // Start the Express server
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
