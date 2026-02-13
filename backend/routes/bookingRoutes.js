const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getFacultyBookings,
  getAllBookings,
  cancelBooking,
  assignFacultySlot,
} = require("../controllers/bookingController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// =======================
// STUDENT ROUTES
// =======================

// Student creates booking
router.post("/", protect, createBooking);

// Student views own bookings (read-only)
router.get("/my", protect, getMyBookings);

// =======================
// FACULTY ROUTES
// =======================
router.post("/assign", protect, assignFacultySlot);

// Faculty views bookings for assigned resources
router.get("/faculty", protect, getFacultyBookings);

// =======================
// ADMIN ROUTES
// =======================

// Admin views ALL bookings
router.get("/", protect, adminOnly, getAllBookings);

// Admin cancels booking
router.put("/:id/cancel", protect, adminOnly, cancelBooking);

module.exports = router;
