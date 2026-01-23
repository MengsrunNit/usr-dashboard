const sequelize = require("../config/database");
const User = require("./user");

// Register additional models
const Job = require("./job");
const JobLineItem = require("./job_items");

// Initialize associations
require("./associations");

// Setup associations if needed
// ...

module.exports = {
  sequelize,
  User,
  Job,
  JobLineItem,
};
