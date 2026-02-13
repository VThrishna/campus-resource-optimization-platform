const Booking = require("../models/Booking");
const Resource = require("../models/Resource");
const timeSlots = require("../utils/timeSlots");

// ===============================
// CREATE BOOKING (STUDENT ONLY)
// ===============================
exports.createBooking = async (req, res) => {
  console.log("========== BOOKING API HIT ==========");
  console.log("USER:", req.user);
  console.log("BODY:", req.body);

  const { resource, slotId, day } = req.body;

  if (req.user.role !== "student") {
    return res.status(403).json({
      message: "Only students can create bookings",
    });
  }

  try {
    // Validate resource
    const resourceExists = await Resource.findById(resource);
    if (!resourceExists || !resourceExists.isActive) {
      return res.status(404).json({
        message: "Resource not available",
      });
    }

    // ✅ FIX: force slotId to number
    const numericSlotId = Number(slotId);

    // Validate slot
    const slot = timeSlots.find((s) => s.id === numericSlotId);
    if (!slot) {
      return res.status(400).json({
        message: "Invalid time slot selected",
      });
    }

    // Resolve date (today / tomorrow)
    const today = new Date();
    const bookingDate = new Date(today);

    if (day === "tomorrow") {
      bookingDate.setDate(today.getDate() + 1);
    } else if (day !== "today") {
      return res.status(400).json({
        message: "Invalid day selection",
      });
    }

    const formattedDate = bookingDate.toISOString().split("T")[0];

    // Conflict check
    const conflict = await Booking.findOne({
      resource,
      date: formattedDate,
      slotId: numericSlotId,
      status: "booked",
    });

    if (conflict) {
      return res.status(400).json({
        message: "Selected slot already booked",
      });
    }

    const booking = await Booking.create({
      resource,
      user: req.user.id,
      role: "student",
      date: formattedDate,
      slotId: numericSlotId,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("BOOKING ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// STUDENT: VIEW OWN BOOKINGS
// ===============================
exports.getMyBookings = async (req, res) => {
  if (req.user.role !== "student") {
    return res.status(403).json({
      message: "Only students can view their bookings",
    });
  }

  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("resource", "name type")
      .sort({ date: 1, slotId: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

// ===============================
// FACULTY: VIEW BOOKINGS
// ===============================
exports.getFacultyBookings = async (req, res) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({
      message: "Only faculty can access this",
    });
  }

  try {
    const resources = await Resource.find({
      assignedFaculty: req.user.id,
    }).select("_id");

    const resourceIds = resources.map((r) => r._id);

    const bookings = await Booking.find({
      resource: { $in: resourceIds },
      status: "booked",
    })
      .populate("resource", "name type")
      .populate("user", "email")
      .sort({ date: 1, slotId: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch faculty bookings",
    });
  }
};

// ===============================
// ADMIN: ASSIGN RESOURCE TO FACULTY (SLOT-BASED)
// ===============================

// @desc   Assign resource slot to faculty
// @route  POST /api/bookings/assign
exports.assignFacultySlot = async (req, res) => {
  const { resource, facultyId, date, slotId } = req.body;

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const slot = timeSlots.find((s) => s.id === slotId);
  if (!slot) {
    return res.status(400).json({ message: "Invalid slot" });
  }

  // Conflict check (same slot)
  const conflict = await Booking.findOne({
    resource,
    date,
    slotId,
    status: "booked",
  });

  if (conflict) {
    return res.status(400).json({
      message: "Slot already assigned or booked",
    });
  }

  const booking = await Booking.create({
    resource,
    user: facultyId,
    role: "faculty",
    date,
    slotId,
    startTime: slot.startTime,
    endTime: slot.endTime,
  });

  res.status(201).json(booking);
};


// ===============================
// ADMIN: VIEW ALL BOOKINGS
// ===============================
exports.getAllBookings = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  try {
    const bookings = await Booking.find()
      .populate("resource", "name type")
      .populate("user", "email role")
      .sort({ date: 1, slotId: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

// ===============================
// ADMIN: CANCEL BOOKING
// ===============================
exports.cancelBooking = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only admin can cancel bookings",
    });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      {
        new: true,
        runValidators: false, // 🔑 THIS IS THE FIX
      }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("CANCEL ERROR:", error);
    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};
