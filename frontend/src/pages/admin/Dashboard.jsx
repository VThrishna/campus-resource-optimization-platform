import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import "../../styles/adminDashboard.css";

const COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [kpis, setKpis] = useState({});
  const [resourceData, setResourceData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [slotData, setSlotData] = useState([]);

  useEffect(() => {
    api.get("/bookings").then((res) => {
      const data = res.data.filter((b) => b.status === "booked");
      setBookings(data);
      processAnalytics(data);
    });
  }, []);

  const processAnalytics = (data) => {
    const today = new Date().toISOString().split("T")[0];

    // ===== KPI CALCULATIONS =====
    const totalBookings = data.length;
    const todaysBookings = data.filter((b) => b.date === today).length;

    const slotMap = {};
    data.forEach((b) => {
      const key = `${b.startTime}-${b.endTime}`;
      slotMap[key] = (slotMap[key] || 0) + 1;
    });

    const mostUsedSlot =
      Object.entries(slotMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    setKpis({
      totalBookings,
      todaysBookings,
      mostUsedSlot,
    });

    // ===== RESOURCE DISTRIBUTION (DONUT) =====
    const resourceMap = {};
    data.forEach((b) => {
      const name = b.resource?.name || "Unknown";
      resourceMap[name] = (resourceMap[name] || 0) + 1;
    });

    const resourceStats = Object.entries(resourceMap).map(
      ([name, value]) => ({ name, value })
    );

    setResourceData(resourceStats);

    // ===== TREND (AREA CHART LAST 30 DAYS) =====
    const trendMap = {};
    data.forEach((b) => {
      trendMap[b.date] = (trendMap[b.date] || 0) + 1;
    });

    const trendStats = Object.entries(trendMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setTrendData(trendStats);

    // ===== SLOT UTILIZATION (RADIAL) =====
    const total = data.length;
    const radial = Object.entries(slotMap).map(([slot, count]) => ({
      name: slot,
      value: Math.round((count / total) * 100),
    }));

    setSlotData(radial);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Analytics</h2>

      {/* ===== KPI CARDS ===== */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Bookings</h4>
          <p>{kpis.totalBookings || 0}</p>
        </div>

        <div className="kpi-card">
          <h4>Today’s Bookings</h4>
          <p>{kpis.todaysBookings || 0}</p>
        </div>

        <div className="kpi-card">
          <h4>Most Used Slot</h4>
          <p>{kpis.mostUsedSlot}</p>
        </div>
      </div>

      {/* ===== DONUT + AREA ===== */}
      <div className="chart-grid">
        <div className="chart-card">
          <h3>Resource Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={resourceData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
              >
                {resourceData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Booking Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorTrend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== RADIAL SLOT UTILIZATION ===== */}
      <div className="chart-card full-width">
        <h3>Slot Utilization (%)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            data={slotData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              fill="#6366f1"
            />
            <Legend />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
