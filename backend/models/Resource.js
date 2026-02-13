const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["classroom", "lab", "equipment"],
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
    },

    // 🔑 NEW: Admin assigns resource to a faculty
    assignedFaculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Who is allowed to use this resource
    assignedRoles: {
      type: [String],
      enum: ["faculty", "student"],
      default: ["student"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
