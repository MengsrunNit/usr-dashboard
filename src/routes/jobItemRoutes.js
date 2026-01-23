const express = require("express");
const router = express.Router();
const job_line_itemsController = require("../controllers/job_itemsController");

// Job line items (JSON)
// Back-compat routes (existing forms/clients)
// router.get("/jobitem", job_line_itemsController.getJobItems);
// router.post("/addjobItem", job_line_itemsController.addJobItem);
// router.post("/editjobItem", job_line_itemsController.editJobItem);
// router.post("/deletejobItem", job_line_itemsController.deleteJobItem);

// REST-style routes
router.get("/jobitems", job_line_itemsController.getJobItems);
router.get("/jobitems/:id", job_line_itemsController.getJobItemById);
router.post("/jobitems", job_line_itemsController.addJobItem);
router.put("/jobitems/:id", job_line_itemsController.editJobItem);
router.patch("/jobitems/:id", job_line_itemsController.editJobItem);
router.delete("/jobitems/:id", job_line_itemsController.deleteJobItem);

module.exports = router;
