import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/facultyResources.css";

const FacultyResources = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fetchResources = async () => {
      // 🔑 Faculty-only assigned resources
      const res = await api.get("/resources/faculty/my");
      setResources(res.data);
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.department || "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || r.type === category;

    return matchesSearch && matchesCategory && r.isActive;
  });

  return (
    <div className="faculty-resource-page">
      <h2>Your Assigned Resources</h2>

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

      {/* Cards */}
      <div className="resource-grid">
        {filteredResources.length === 0 ? (
          <p>No resources assigned to you.</p>
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

                <span className="badge available">Assigned</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyResources;
