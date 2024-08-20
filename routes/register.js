//api for register new user
const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");

//router.route("/").post(registerController.handleNewUser);

router.post("/", registerController.handleNewUser);

module.exports = router;