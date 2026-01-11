const { Sequelize } = require("sequelize");
const env = require("./env");

// Initialize Sequelize instance
const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: env.DB_HOST,
  dialect: env.DB_DIALECT,
  logging: false, // set to console.log for SQL debugging
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: false,
  },
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("[DB] Connection established");
  } catch (err) {
    console.error("[DB] Connection failed:", err.message);
    throw err;
  }
}
module.exports = sequelize;
module.exports.testConnection = testConnection;
