import { useState } from "react";
import api from "../../services/api";
import "../../styles/bookingModal.css";

const BookingModal = ({ resource, onClose }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!date || !startTime || !endTime) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("/bookings", {
        resource: resource._id,
        date,
        startTime,
        endTime,
      });

      setSuccess("Booking confirmed!");
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed"
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="booking-modal">
        <h3>Reserve {resource.name}</h3>
        <p>{resource.department}</p>

        <form onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <label>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-btn">
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
