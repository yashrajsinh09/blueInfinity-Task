const express = require("express");
const { createUser, login, getUser } = require("../controller/user");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/create-user", createUser);
router.post("/login", login);
router.get("/get-user", [auth], getUser);

module.exports = router;
