import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* USER COMPONENTS */
import NavBar from "./Components/NavBar/NavBar";
import Banner from "./Components/Banner/Banner";
import Card from "./Components/Card/Card";
import Footer from "./Components/Footer/Footer";

import Detailed from "./Components/Detailed/Detailed";
import Services from "./Components/services/Services";
import ServiceCenters from "./Components/services/ServiceCenters";
import History from "./Components/History/History";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";


/* OWNER COMPONENTS */
import OwnerLogin from "./Components/owner/Login/Ownerlogin";
import RegisterPage from "./Components/owner/Register/Register";
import OwnerDashboard from "./Components/owner/Dashboard/OwnerDashboard";
import OwnerBookings from "./Components/owner/Bookings/OwnerBookings";
import OwnerProfile from "./Components/owner/profile/OwnerProfile";
import OwnerServices from "./Components/owner/services/services";
// import OwnerTimeSlots from "./Components/owner/TimeSlots/TimeSlot";
import AddShop from "./Components/owner/AddShop/AddShop";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ================= DEFAULT ROUTE ================= */}

        <Route path="/" element={<Navigate to="/login" />} />

        {/* ================= USER SIDE ================= */}

        <Route
          path="/home"
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

        <Route
          path="/register"
          element={
            <>
              <NavBar />
              <Register />
              <Footer />
            </>
          }
        />



        {/* ================= OWNER SIDE ================= */}

        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/register" element={<RegisterPage />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
        <Route path="/owner/services" element={<OwnerServices />} />
        <Route path="/owner/addShop" element={<AddShop />} />
        {/* <Route path="/owner/timeslots" element={<OwnerTimeSlots />} /> */}

      </Routes>
    </Router>
  );
}