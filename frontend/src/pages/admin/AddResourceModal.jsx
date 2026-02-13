import { useState } from "react";
import api from "../../services/api";
import "../../styles/adminResources.css";

const AddResourceModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    type: "classroom",
    capacity: "",
    department: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/resources", {
      ...form,
      capacity: Number(form.capacity),
      assignedRoles: ["faculty", "student"],
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Resource</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Resource name"
            onChange={handleChange}
            required
          />

          <select name="type" onChange={handleChange}>
            <option value="classroom">Classroom</option>
            <option value="lab">Laboratory</option>
            <option value="equipment">Equipment</option>
          </select>

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Location / Department"
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-btn">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
