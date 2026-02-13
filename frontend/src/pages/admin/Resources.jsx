import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/adminResources.css";
import AddResourceModal from "./AddResourceModal";

const TIME_SLOTS = [
  { id: 1, label: "08:45 – 10:30" },
  { id: 2, label: "10:30 – 12:20" },
  { id: 3, label: "13:30 – 15:15" },
  { id: 4, label: "15:30 – 16:30" },
];

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // slot assignment state
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [day, setDay] = useState("today");

  const fetchResources = async () => {
    const res = await api.get("/resources");
    setResources(res.data);
  };

  const fetchFaculty = async () => {
    const res = await api.get("/users/faculty");
    setFacultyList(res.data);
  };

  useEffect(() => {
    fetchResources();
    fetchFaculty();
  }, []);

  const assignFacultySlot = async (resourceId) => {
    if (!selectedFaculty || !selectedSlot) {
      alert("Select faculty and slot");
      return;
    }

    // resolve date
    const today = new Date();
    const date = new Date(today);
    if (day === "tomorrow") date.setDate(today.getDate() + 1);
    const formattedDate = date.toISOString().split("T")[0];

    try {
      await api.post("/bookings/assign", {
        resource: resourceId,
        facultyId: selectedFaculty,
        slotId: Number(selectedSlot),
        date: formattedDate,
      });

      alert("Faculty slot assigned successfully");
      setSelectedFaculty("");
      setSelectedSlot("");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to assign faculty slot"
      );
    }
  };

  return (
    <div className="admin-resource-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h2>Resource Management</h2>
          <p>Assign resources to faculty by time slot</p>
        </div>

        <button className="primary-btn" onClick={() => setShowModal(true)}>
          + Add Resource
        </button>
      </div>

      {/* Table */}
      <div className="resource-table">
        <div className="table-head">
          <span>RESOURCE</span>
          <span>CATEGORY</span>
          <span>FACULTY</span>
          <span>DAY</span>
          <span>SLOT</span>
          <span>ACTION</span>
        </div>

        {resources.map((r) => (
          <div className="table-row" key={r._id}>
            <div>
              <strong>{r.name}</strong>
              <small>{r.department || "—"}</small>
            </div>

            <span className="badge">{r.type}</span>

            {/* Faculty */}
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="">Select Faculty</option>
              {facultyList.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>

            {/* Day */}
            <select value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
            </select>

            {/* Slot */}
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
            >
              <option value="">Select Slot</option>
              {TIME_SLOTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>

            <button
              className="primary-btn"
              onClick={() => assignFacultySlot(r._id)}
            >
              Assign
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <AddResourceModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchResources}
        />
      )}
    </div>
  );
};

export default AdminResources;
