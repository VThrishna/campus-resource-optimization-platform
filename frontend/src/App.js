import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Faculty
import FacultyLayout from "./faculty/FacultyLayout";
import FacultyDashboard from "./pages/faculty/Dashboard";
import FacultyResources from "./pages/faculty/Resources";
import FacultyBookings from "./pages/faculty/Bookings";

// Admin
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminResources from "./pages/admin/Resources";
import AdminBookings from "./pages/admin/Bookings"; // ✅ ADD THIS

// Student
import StudentLayout from "./student/StudentLayout";
import StudentDashboard from "./pages/student/Dashboard";
import StudentResources from "./pages/student/Resources";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Faculty */}
      <Route element={<ProtectedRoute role="faculty" />}>
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="resources" element={<FacultyResources />} />
          <Route path="bookings" element={<FacultyBookings />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="bookings" element={<AdminBookings />} /> {/* ✅ ADD */}
        </Route>
      </Route>

      {/* Student */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="resources" element={<StudentResources />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
