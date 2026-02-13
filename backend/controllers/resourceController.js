const Resource = require("../models/Resource");
const User = require("../models/User");

// @desc   Create resource (Admin)
// @route  POST /api/resources
exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Get all resources (Admin)
// @route  GET /api/resources
exports.getResources = async (req, res) => {
  const resources = await Resource.find().populate(
    "assignedFaculty",
    "name email"
  );
  res.json(resources);
};

// @desc   Update resource (Admin)
// @route  PUT /api/resources/:id
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete resource (Admin)
// @route  DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return res.status(404).json({ message: "Resource not found" });
  }

  await resource.deleteOne();
  res.json({ message: "Resource removed" });
};

// ===============================
// 🔑 NEW FEATURES START HERE
// ===============================

// @desc   Assign faculty to resource (Admin)
// @route  PUT /api/resources/:id/assign-faculty
exports.assignFaculty = async (req, res) => {
  const { facultyId } = req.body;

  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    resource.assignedFaculty = facultyId || null;
    await resource.save();

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: "Failed to assign faculty" });
  }
};

// @desc   Get resources assigned to logged-in faculty
// @route  GET /api/resources/faculty/my
exports.getFacultyResources = async (req, res) => {
  const resources = await Resource.find({
    assignedFaculty: req.user.id,
    isActive: true,
  });

  res.json(resources);
};
