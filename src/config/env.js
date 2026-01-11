// Centralized environment loader with sensible defaults
const crypto = require("crypto");

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3000),
  // DB (MySQL)
  DB_NAME: process.env.DB_NAME || "usr_dashboard_db",
  DB_USER: process.env.DB_USER || "root",
  DB_PASS: process.env.DB_PASS || "",
  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_DIALECT: process.env.DB_DIALECT || "mysql",
  // Session/crypto
  SESSION_SECRET:
    process.env.SESSION_SECRET || crypto.randomBytes(24).toString("hex"),
};

module.exports = env;
