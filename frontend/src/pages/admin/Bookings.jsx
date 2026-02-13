import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/adminResources.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

const cancelBooking = async (id) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this booking?"
  );
  if (!confirmCancel) return;

  try {
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  } catch (err) {
    console.error("Cancel booking error:", err.response || err);
    alert(
      err.response?.data?.message ||
        "Failed to cancel booking (check backend logs)"
    );
  }
};


  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="admin-resource-page">
      <h2>All Bookings</h2>

      <div className="resource-table">
        <div className="table-head">
          <span>RESOURCE</span>
          <span>STUDENT</span>
          <span>DATE</span>
          <span>TIME</span>
          <span>STATUS</span>
          <span>ACTION</span>
        </div>

        {bookings.length === 0 ? (
          <p style={{ padding: "16px" }}>No bookings found</p>
        ) : (
          bookings.map((b) => (
            <div className="table-row" key={b._id}>
              <span>{b.resource?.name || "—"}</span>
              <span>{b.user?.email || "—"}</span>
              <span>{b.date}</span>
              <span>
                {b.startTime} – {b.endTime}
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

              <span>
                {b.status === "booked" ? (
                  <button
                    className="danger-btn"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel
                  </button>
                ) : (
                  "—"
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
