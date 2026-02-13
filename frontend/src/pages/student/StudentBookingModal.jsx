import { useState } from "react";
import api from "../../services/api";
import "../../styles/modal.css";

const TIME_SLOTS = [
  { id: 1, label: "08:45 – 10:30" },
  { id: 2, label: "10:30 – 12:20" },
  { id: 3, label: "13:30 – 15:15" },
  { id: 4, label: "15:30 – 16:30" },
];

const StudentBookingModal = ({ resource, onClose }) => {
  const [slotId, setSlotId] = useState(null); // ✅ FIX
  const [day, setDay] = useState("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBooking = async () => {
    if (!slotId) {
      setError("Please select a valid time slot");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/bookings", {
  resource: resource._id,
  slotId: parseInt(slotId, 10),
  day,
});


      alert("Booking successful");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Book Resource</h3>

        <p>
          <strong>{resource.name}</strong>
        </p>

        <label>Day</label>
        <select value={day} onChange={(e) => setDay(e.target.value)}>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
        </select>

        <label>Time Slot</label>
        <select
          value={slotId ?? ""}
          onChange={(e) => setSlotId(Number(e.target.value))}
        >
          <option value="">Select slot</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {slot.label}
            </option>
          ))}
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="primary-btn"
            onClick={handleBooking}
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBookingModal;
