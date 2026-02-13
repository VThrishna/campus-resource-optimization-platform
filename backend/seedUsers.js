const mongoose = require("mongoose");
const User = require("./models/User"); // ✅ FIXED PATH
const bcrypt = require("bcryptjs");
require("dotenv").config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();

    const users = [
      {
        name: "Admin User",
        email: "admin@campus.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
      {
        name: "Faculty One",
        email: "faculty1@campus.com",
        password: await bcrypt.hash("faculty123", 10),
        role: "faculty",
      },
      {
        name: "Faculty Two",
        email: "faculty2@campus.com",
        password: await bcrypt.hash("faculty123", 10),
        role: "faculty",
      },
      {
        name: "Faculty Three",
        email: "faculty3@campus.com",
        password: await bcrypt.hash("faculty123", 10),
        role: "faculty",
      },
      {
        name: "Student One",
        email: "student@campus.com",
        password: await bcrypt.hash("student123", 10),
        role: "student",
      },
    ];

    await User.insertMany(users);

    console.log("✅ Users seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedUsers();
