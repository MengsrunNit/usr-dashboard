require("dotenv").config();
const app = require("./app");
const env = require("./config/env");
const { sequelize } = require("./models");
const { testConnection } = require("./config/database");
const fs = require("fs");
const path = require("path");

async function ensureDirs() {
  const dirs = [path.join(__dirname, "public")];
  for (const d of dirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
      console.log(`[init] Created directory: ${d}`);
    }
  }
}

async function start() {
  try {
    await ensureDirs();
    await testConnection();
    // Avoid automatically altering schema on startup.
    // If you really want Sequelize to reconcile schema in dev, run with DB_SYNC_ALTER=true.
    const shouldAlter = process.env.DB_SYNC_ALTER === "true";
    await sequelize.sync(shouldAlter ? { alter: true } : undefined);
    const server = app.listen(env.PORT, () => {
      console.log(
        `USR Dashboard API listening on http://localhost:${env.PORT}`
      );
    });

    function shutdown(sig) {
      console.log(`\n${sig} received. Shutting down...`);
      server.close(async () => {
        try {
          await sequelize.close();
          console.log("Sequelize connection closed.");
        } catch (e) {
          console.error("Error closing DB:", e.message);
        }
        process.exit(0);
      });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
    });
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

start();
