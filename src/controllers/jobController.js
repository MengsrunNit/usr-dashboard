const Job = require("../models/job");

function toInt(value) {
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function toNumber(value) {
  const n = Number(String(value));
  return Number.isFinite(n) ? n : null;
}

function toDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ order: [["job_id", "DESC"]] });
    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const id = toInt(req.params?.id);
    if (id == null) return res.status(400).json({ message: "id is required" });

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ message: "Failed to fetch job" });
  }
};

exports.addJob = async (req, res) => {
  try {
    const {
      title,
      customerName,
      scheduledAt,
      address,
      status,
      estimatedRevenue,
      notes,
      lat,
      lng,
    } = req.body;

    if (!title || String(title).trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }
    if (!customerName || String(customerName).trim() === "") {
      return res.status(400).json({ message: "customerName is required" });
    }
    const scheduled = toDate(scheduledAt);
    if (!scheduled) {
      return res
        .status(400)
        .json({ message: "scheduledAt must be a valid date" });
    }
    if (!address || String(address).trim() === "") {
      return res.status(400).json({ message: "address is required" });
    }

    const job = await Job.create({
      title: String(title).trim(),
      customerName: String(customerName).trim(),
      scheduledAt: scheduled,
      address: String(address).trim(),
      status: status || undefined,
      estimatedRevenue:
        estimatedRevenue !== undefined ? toNumber(estimatedRevenue) : undefined,
      notes: notes !== undefined ? String(notes) : undefined,
      lat: lat !== undefined && lat !== "" ? toNumber(lat) : undefined,
      lng: lng !== undefined && lng !== "" ? toNumber(lng) : undefined,
    });

    return res.status(201).json(job);
  } catch (error) {
    console.error("Error adding job:", error);
    if (error?.name === "SequelizeValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to add job" });
  }
};

exports.editJob = async (req, res) => {
  try {
    const id = toInt(req.params?.id);
    if (id == null) return res.status(400).json({ message: "id is required" });

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const updateData = {};
    const body = req.body || {};

    if (body.title !== undefined) {
      if (!body.title || String(body.title).trim() === "") {
        return res.status(400).json({ message: "title cannot be empty" });
      }
      updateData.title = String(body.title).trim();
    }
    if (body.customerName !== undefined) {
      if (!body.customerName || String(body.customerName).trim() === "") {
        return res
          .status(400)
          .json({ message: "customerName cannot be empty" });
      }
      updateData.customerName = String(body.customerName).trim();
    }
    if (body.scheduledAt !== undefined) {
      const scheduled = toDate(body.scheduledAt);
      if (!scheduled) {
        return res
          .status(400)
          .json({ message: "scheduledAt must be a valid date" });
      }
      updateData.scheduledAt = scheduled;
    }
    if (body.address !== undefined) {
      if (!body.address || String(body.address).trim() === "") {
        return res.status(400).json({ message: "address cannot be empty" });
      }
      updateData.address = String(body.address).trim();
    }
    if (body.status !== undefined) updateData.status = body.status;
    if (body.estimatedRevenue !== undefined)
      updateData.estimatedRevenue = toNumber(body.estimatedRevenue);
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.lat !== undefined)
      updateData.lat = body.lat === "" ? null : toNumber(body.lat);
    if (body.lng !== undefined)
      updateData.lng = body.lng === "" ? null : toNumber(body.lng);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    await job.update(updateData);
    return res.status(200).json(job);
  } catch (error) {
    console.error("Error editing job:", error);
    if (error?.name === "SequelizeValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to edit job" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const id = toInt(req.params?.id);
    if (id == null) return res.status(400).json({ message: "id is required" });

    const job = await Job.findByPk(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await job.destroy();
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Failed to delete job" });
  }
};
