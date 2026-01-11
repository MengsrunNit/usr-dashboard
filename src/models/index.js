const sequelize = require("../config/database");
const User = require("./user");

// Setup associations if needed
// ...

module.exports = {
  sequelize,
  User,
};
