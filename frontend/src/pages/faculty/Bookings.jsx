import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/adminResources.css";

const FacultyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/faculty");
        setBookings(res.data);
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-resource-page">
      <h2>Bookings for Your Assigned Resources</h2>

      <div className="resource-table">
        <div className="table-head">
          <span>RESOURCE</span>
          <span>STUDENT</span>
          <span>DATE</span>
          <span>TIME</span>
          <span>STATUS</span>
        </div>

        {bookings.length === 0 ? (
          <p style={{ padding: "16px" }}>
            No bookings for your resources yet.
          </p>
        ) : (
          bookings.map((b) => (
            <div className="table-row" key={b._id}>
              <span>{b.resource?.name}</span>
              <span>{b.user?.email}</span>
              <span>{b.date}</span>
              <span>
                {b.startTime} - {b.endTime}
              </span>
              <span
                className={`status ${
                  b.status === "booked"
                    ? "available"
                    : "maintenance"
                }`}
              >
                {b.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyBookings;
