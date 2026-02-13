import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/studentDashboard.css";

const StudentDashboard = () => {
  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings/my");

        const today = new Date().toISOString().split("T")[0];

        const todayArr = [];
        const upcomingArr = [];
        const pastArr = [];

        res.data.forEach((b) => {
          if (b.status === "cancelled") {
            pastArr.push(b);
          } else if (b.date === today) {
            todayArr.push(b);
          } else if (b.date > today) {
            upcomingArr.push(b);
          } else {
            pastArr.push(b);
          }
        });

        setTodayBookings(todayArr);
        setUpcomingBookings(upcomingArr);
        setPastBookings(pastArr);
      } catch (err) {
        console.error("Failed to fetch student bookings", err);
      }
    };

    fetchBookings();
  }, []);

  const renderList = (list, emptyMsg) =>
    list.length === 0 ? (
      <p className="empty">{emptyMsg}</p>
    ) : (
      list.map((b) => (
        <div className="booking-card" key={b._id}>
          <strong>{b.resource?.name}</strong>
          <p>Type: {b.resource?.type}</p>
          <p>Date: {b.date}</p>
          <p>
            Time: {b.startTime} – {b.endTime}
          </p>
          <span className={`status ${b.status}`}>
            {b.status}
          </span>
        </div>
      ))
    );

  return (
    <div className="student-dashboard">
      <h2>My Bookings</h2>

      <section>
        <h3>Today's Bookings</h3>
        {renderList(todayBookings, "No bookings")}
      </section>

      <section>
        <h3>Upcoming Bookings</h3>
        {renderList(upcomingBookings, "No bookings")}
      </section>

      <section>
        <h3>Past Bookings</h3>
        {renderList(pastBookings, "No bookings")}
      </section>
    </div>
  );
};

export default StudentDashboard;
