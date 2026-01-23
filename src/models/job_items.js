const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const JobLineItem = sequelize.define(
  "JobLineItem",
  {
    job_line_item_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    job_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    rule_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "job_line_items",
    timestamps: true,
    underscored: true,
  }
);

module.exports = JobLineItem;
