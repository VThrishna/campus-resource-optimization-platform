import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/facultyDashboard.css";

const Dashboard = () => {
  const [todaySlots, setTodaySlots] = useState([]);
  const [upcomingSlots, setUpcomingSlots] = useState([]);
  const [pastSlots, setPastSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultySlots = async () => {
      try {
        const res = await api.get("/bookings/faculty");

        const today = new Date().toISOString().split("T")[0];

        const todayArr = [];
        const upcomingArr = [];
        const pastArr = [];

        res.data.forEach((b) => {
          if (b.status !== "booked") return;

          if (b.date === today) {
            todayArr.push(b);
          } else if (b.date > today) {
            upcomingArr.push(b);
          } else {
            pastArr.push(b);
          }
        });

        setTodaySlots(todayArr);
        setUpcomingSlots(upcomingArr);
        setPastSlots(pastArr);
      } catch (err) {
        console.error("Failed to load faculty slots", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultySlots();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="faculty-dashboard">
      <h2>Faculty Dashboard</h2>
      <p className="subtitle">
        View your assigned resource slots
      </p>

      <div className="dashboard-grid">
        {/* TODAY */}
        <DashboardCard
          title="Today’s Slots"
          data={todaySlots}
          emptyText="No slots assigned today"
        />

        {/* UPCOMING */}
        <DashboardCard
          title="Upcoming Slots"
          data={upcomingSlots}
          emptyText="No upcoming slots"
        />

        {/* PAST */}
        <DashboardCard
          title="Past Slots"
          data={pastSlots}
          emptyText="No past slots"
          muted
        />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, data, emptyText, muted }) => (
  <div className={`dashboard-card ${muted ? "muted" : ""}`}>
    <h3>{title}</h3>

    {data.length === 0 ? (
      <p className="empty">{emptyText}</p>
    ) : (
      <ul className="slot-list">
        {data.map((b) => (
          <li key={b._id} className="slot-item">
            <strong>{b.resource?.name}</strong>
            <span>
              {b.startTime} – {b.endTime}
            </span>
            <span className="date">{b.date}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Dashboard;
