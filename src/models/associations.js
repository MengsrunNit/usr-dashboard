const Job = require("./job");
const JobLineItem = require("./job_items");

Job.hasMany(JobLineItem, {
  foreignKey: "job_id",
  as: "lineItems",
  onDelete: "CASCADE",
});

JobLineItem.belongsTo(Job, {
  foreignKey: "job_id",
  as: "job",
});

module.exports = { Job, JobLineItem };
