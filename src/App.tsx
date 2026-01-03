import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./Components/NavBar/NavBar";
import Banner from "./Components/Banner/Banner";
import Card from "./Components/Card/Card";
import Footer from "./Components/Footer/Footer";

import Detailed from "./Components/Detailed/Detailed";
import History from "./Components/History/History";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";

export default function App() {
  return (
    <Router>
      {/* Common layout */}
      <NavBar />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Card />
            </>
          }
        />

        {/* Details page (IMPORTANT) */}
        <Route path="/details/:id" element={<Detailed />} />

        {/* History */}
        <Route path="/history" element={<History />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </Router>
  );
}
