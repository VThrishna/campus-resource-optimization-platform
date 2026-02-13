const express = require("express");
const router = express.Router();

const {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  assignFaculty,
  getFacultyResources,
} = require("../controllers/resourceController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// =======================
// ADMIN ROUTES
// =======================

// Create resource
router.post("/", protect, adminOnly, createResource);

// Update resource
router.put("/:id", protect, adminOnly, updateResource);

// Delete resource
router.delete("/:id", protect, adminOnly, deleteResource);

// Assign resource to faculty
router.put(
  "/:id/assign-faculty",
  protect,
  adminOnly,
  assignFaculty
);

// =======================
// FACULTY ROUTES
// =======================

// Get resources assigned to logged-in faculty
router.get(
  "/faculty/my",
  protect,
  getFacultyResources
);

// =======================
// COMMON ROUTES
// =======================

// Get all resources (Admin view)
router.get("/", protect, getResources);

module.exports = router;
