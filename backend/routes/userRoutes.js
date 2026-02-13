const express = require("express");
const router = express.Router();

const { getFacultyUsers } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Admin only
router.get("/faculty", protect, adminOnly, getFacultyUsers);

module.exports = router;
