const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// HTML pages
router.get("/getUser", userController.getUsers); // list page
router.get("/addUser", userController.getAddUser); // add user page
router.post("/addUser", userController.postAddUser); // create user

module.exports = router;
