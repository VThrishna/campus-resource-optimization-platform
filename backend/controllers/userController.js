const User = require("../models/User");

// @desc   Get all faculty users (Admin)
// @route  GET /api/users/faculty
exports.getFacultyUsers = async (req, res) => {
  const faculty = await User.find({ role: "faculty" }).select(
    "_id name email"
  );

  res.json(faculty);
};
