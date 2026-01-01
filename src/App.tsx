import NavBar from './Components/NavBar/NavBar';
import Banner from './Components/Banner/Banner';
import Card from './Components/Card/Card';
import Footer from './Components/Footer/Footer';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Detailed from './Components/Detailed/Detailed';
import History from './Components/History/History';
import Profile from './Components/Profile/Profile';
import Login from './Components/Login/Login';

export default function App() {
  return (
    <Router>
      <Routes>

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
          path="/Details"
          element={
            <>
              <NavBar />
              <Detailed />
              <Footer />
            </>
          }
        />

        <Route
          path="/History"
          element={
            <>
              <NavBar />
              <History />
              <Footer />
            </>
          }
        />

        <Route
          path="/Profile"
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

      </Routes>
    </Router>
  );
}
