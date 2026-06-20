import "dotenv/config";
import express from "express";

async function startServer() {
  try {
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
