import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./Components/NavBar/NavBar";
import Banner from "./Components/Banner/Banner";
import Card from "./Components/Card/Card";
import Footer from "./Components/Footer/Footer";

import Detailed from "./Components/Detailed/Detailed";
import Services from "./Components/services/Services";
import ServiceCenters from "./Components/Detailed/Detailed"; // ✅ ADD THIS
import History from "./Components/History/History";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";

/* OWNER */
import OwnerLogin from "./Components/owner/Login/Ownerlogin";
import OwnerDashboard from "./Components/owner/Dashboard/OwnerDashboard";
import OwnerBookings from "./Components/owner/Bookings/OwnerBookings";
import OwnerProfile from "./Components/owner/profile/OwnerProfile";
import OwnerServices from "./Components/owner/services/services";
import OwnerTimeSlots from "./Components/owner/TimeSlots/TimeSlot";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ================= USER SIDE ================= */}

        <Route
          path="/"
          element={
            <>
              <NavBar />
              <Banner />
              <Card />
              <Footer />
            </>
          }
        />

        <Route
          path="/details/:id"
          element={
            <>
              <NavBar />
              <Detailed />
              <Footer />
            </>
          }
        />

        {/* SERVICES LIST */}
        <Route
          path="/services"
          element={
            <>
              <NavBar />
              <Services />
              <Footer />
            </>
          }
        />

        {/* ✅ SERVICE → CENTERS LIST (Express Wash, etc.) */}
        <Route
          path="/services/:serviceName"
          element={
            <>
              <NavBar />
              <ServiceCenters />
              <Footer />
            </>
          }
        />

        <Route
          path="/history"
          element={
            <>
              <NavBar />
              <History />
              <Footer />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <NavBar />
              <Profile />
              <Footer />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <NavBar />
              <Login />
              <Footer />
            </>
          }
        />

        {/* ================= OWNER SIDE ================= */}
        {/* NO NAVBAR / FOOTER HERE */}

        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
        <Route path="/owner/services" element={<OwnerServices />} />
        <Route path="/owner/TimeSlots" element={<OwnerTimeSlots />} />

      </Routes>
    </Router>
  );
}
