const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

// Jobs (JSON)
router.get("/jobs", jobController.getJobs);
router.get("/jobs/:id", jobController.getJobById);
router.post("/jobs", jobController.addJob);
router.put("/jobs/:id", jobController.editJob);
router.patch("/jobs/:id", jobController.editJob);
router.delete("/jobs/:id", jobController.deleteJob);

module.exports = router;
