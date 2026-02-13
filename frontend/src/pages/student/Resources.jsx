import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/facultyResources.css";
import StudentBookingModal from "./StudentBookingModal";

const StudentResources = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      const res = await api.get("/resources");

      // Students see only active & student-allowed resources
      const studentResources = res.data.filter(
        (r) => r.isActive && r.assignedRoles?.includes("student")
      );

      setResources(studentResources);
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.department || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || r.type === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="faculty-resource-page">
      <h2>Book Available Resources</h2>

      {/* Search & Filter */}
      <div className="resource-filters">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="classroom">Classroom</option>
          <option value="lab">Laboratory</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>

      {/* Resource Cards */}
      <div className="resource-grid">
        {filteredResources.length === 0 ? (
          <p>No resources available for booking.</p>
        ) : (
          filteredResources.map((r) => (
            <div className="resource-card" key={r._id}>
              <div className="card-header">
                <span className="card-type">{r.type}</span>
                <span className="status available">✓</span>
              </div>

              <div className="card-body">
                <h3>{r.name}</h3>
                <p className="location">{r.department}</p>

                <p className="capacity">
                  👥 Capacity: {r.capacity}
                </p>

                <span className="badge available">Bookable</span>
              </div>

              <button
                className="reserve-btn"
                onClick={() => setSelectedResource(r)}
              >
                📅 Book Slot
              </button>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {selectedResource && (
        <StudentBookingModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
};

export default StudentResources;
