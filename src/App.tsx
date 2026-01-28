import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* USER COMPONENTS */
import NavBar from "./Components/NavBar/NavBar";
import Banner from "./Components/Banner/Banner";
import Card from "./Components/Card/Card";
import Footer from "./Components/Footer/Footer";

import Detailed from "./Components/Detailed/Detailed";
import Services from "./Components/services/Services";
import History from "./Components/History/History";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";

/* OWNER COMPONENTS */
import OwnerLogin from "./Components/owner/Login/Ownerlogin";
import OwnerDashboard from "./Components/owner/Dashboard/OwnerDashboard";
import OwnerBookings from "./Components/owner/Bookings/OwnerBookings";
import OwnerProfile from "./Components/owner/profile/OwnerProfile";
import OwnerServices from "./Components/owner/services/Services";
import OwnerTimeSlots from "./Components/owner/TimeSlots/TimeSlot";

/* CONTEXT */
import AuthProvider from "./Context/UserContext";
import Register from "./Components/Register/Register";
import RegisterPage from "./Components/owner/Register/Register";
import AddShop from "./Components/owner/AddShop/AddShop";

export default function App() {
  return (
    <Router>
      <AuthProvider>
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
          {/* NO NAVBAR / FOOTER */}
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/register" element={<RegisterPage/>} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/bookings" element={<OwnerBookings />} />
          <Route path="/owner/profile" element={<OwnerProfile />} />
          <Route path="/owner/services" element={<OwnerServices />} />
          <Route path="/owner/addShop" element={<AddShop />} />
          <Route path="/owner/timeslots" element={<OwnerTimeSlots />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}
