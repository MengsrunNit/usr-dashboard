const JobLineItem = require("../models/job_items");
const Job = require("../models/job");

function toInt(value) {
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function toNumber(value) {
  const n = Number(String(value));
  return Number.isFinite(n) ? n : null;
}

function getLineItemId(req) {
  return (
    toInt(req.params?.id) ||
    toInt(req.params?.job_line_item_id) ||
    toInt(req.body?.job_line_item_id) ||
    null
  );
}

// GET all job line items (optionally filter by job_id)
exports.getJobItems = async (req, res) => {
  try {
    const where = {};
    if (req.query?.job_id != null && req.query.job_id !== "") {
      const jobId = toInt(req.query.job_id);
      if (jobId == null) {
        return res.status(400).json({ message: "job_id must be an integer" });
      }
      where.job_id = jobId;
    }

    const jobItems = await JobLineItem.findAll({
      where,
      order: [["job_line_item_id", "DESC"]],
    });
    res.status(200).json(jobItems);
  } catch (error) {
    console.error("Error fetching job items:", error);
    res.status(500).json({ message: "Failed to fetch job items" });
  }
};

// GET a single job line item by id
exports.getJobItemById = async (req, res) => {
  try {
    const id = getLineItemId(req);
    if (id == null) {
      return res.status(400).json({ message: "job_line_item_id is required" });
    }

    const jobItem = await JobLineItem.findByPk(id);
    if (!jobItem) {
      return res.status(404).json({ message: "Job item not found" });
    }

    return res.status(200).json(jobItem);
  } catch (error) {
    console.error("Error fetching job item:", error);
    return res.status(500).json({ message: "Failed to fetch job item" });
  }
};

// ADD a new job line item
exports.addJobItem = async (req, res) => {
  try {
    const { job_id, description, quantity, unit_price, rule_code } = req.body;

    const jobId = toInt(job_id);
    const qty = toInt(quantity);
    const unitPrice = toNumber(unit_price);

    if (jobId == null) {
      return res.status(400).json({ message: "job_id is required" });
    }

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res
        .status(400)
        .json({ message: `job_id ${jobId} does not exist` });
    }
    if (!description || String(description).trim() === "") {
      return res.status(400).json({ message: "description is required" });
    }
    if (qty == null || qty < 0) {
      return res.status(400).json({ message: "quantity must be >= 0" });
    }
    if (unitPrice == null || unitPrice < 0) {
      return res.status(400).json({ message: "unit_price must be >= 0" });
    }
    if (!rule_code || String(rule_code).trim() === "") {
      return res.status(400).json({ message: "rule_code is required" });
    }

    const newJobItem = await JobLineItem.create({
      job_id: jobId,
      description: String(description).trim(),
      quantity: qty,
      unit_price: unitPrice,
      rule_code: String(rule_code).trim(),
    });

    res.status(201).json(newJobItem);
  } catch (error) {
    console.error("Error adding job item:", error);
    if (
      error?.name === "SequelizeForeignKeyConstraintError" ||
      error?.original?.code === "ER_NO_REFERENCED_ROW_2"
    ) {
      return res
        .status(400)
        .json({ message: "Invalid job_id (job not found)" });
    }
    if (error?.name === "SequelizeValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to add job item" });
  }
};

// EDIT an existing job line item
exports.editJobItem = async (req, res) => {
  try {
    const id = getLineItemId(req);
    if (id == null) {
      return res.status(400).json({ message: "job_line_item_id is required" });
    }

    const { job_id, description, quantity, unit_price, rule_code } = req.body;

    const jobItem = await JobLineItem.findByPk(id);

    if (!jobItem) {
      return res.status(404).json({ message: "Job item not found" });
    }

    const updateData = {};
    if (job_id !== undefined) {
      const jobId = toInt(job_id);
      if (jobId == null) {
        return res.status(400).json({ message: "job_id must be an integer" });
      }

      const job = await Job.findByPk(jobId);
      if (!job) {
        return res
          .status(400)
          .json({ message: `job_id ${jobId} does not exist` });
      }

      updateData.job_id = jobId;
    }
    if (description !== undefined) {
      if (!description || String(description).trim() === "") {
        return res.status(400).json({ message: "description cannot be empty" });
      }
      updateData.description = String(description).trim();
    }
    if (quantity !== undefined) {
      const qty = toInt(quantity);
      if (qty == null || qty < 0) {
        return res.status(400).json({ message: "quantity must be >= 0" });
      }
      updateData.quantity = qty;
    }
    if (unit_price !== undefined) {
      const unitPrice = toNumber(unit_price);
      if (unitPrice == null || unitPrice < 0) {
        return res.status(400).json({ message: "unit_price must be >= 0" });
      }
      updateData.unit_price = unitPrice;
    }
    if (rule_code !== undefined) {
      if (!rule_code || String(rule_code).trim() === "") {
        return res.status(400).json({ message: "rule_code cannot be empty" });
      }
      updateData.rule_code = String(rule_code).trim();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await jobItem.update(updateData);

    return res.status(200).json(jobItem);
  } catch (error) {
    console.error("Error editing job item:", error);
    if (
      error?.name === "SequelizeForeignKeyConstraintError" ||
      error?.original?.code === "ER_NO_REFERENCED_ROW_2"
    ) {
      return res
        .status(400)
        .json({ message: "Invalid job_id (job not found)" });
    }
    if (error?.name === "SequelizeValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to edit job item" });
  }
};

// DELETE a job line item
exports.deleteJobItem = async (req, res) => {
  try {
    const id = getLineItemId(req);
    if (id == null) {
      return res.status(400).json({ message: "job_line_item_id is required" });
    }

    const jobItem = await JobLineItem.findByPk(id);

    if (!jobItem) {
      return res.status(404).json({ message: "Job item not found" });
    }

    await jobItem.destroy();

    res.status(200).json({ message: "Job item deleted successfully" });
  } catch (error) {
    console.error("Error deleting job item:", error);
    res.status(500).json({ message: "Failed to delete job item" });
  }
};
