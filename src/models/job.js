const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Job = sequelize.define(
  "Job",
  {
    job_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    customerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },

    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
      ),
      allowNull: false,
      defaultValue: "SCHEDULED",
    },

    estimatedRevenue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0.0,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "jobs",
    timestamps: true, // createdAt & updatedAt handled automatically
    underscored: true, // maps created_at, updated_at in MySQL
  }
);

module.exports = Job;
