import React from 'react'
import NavBar from './Components/NavBar/NavBar'
import Banner from './Components/Banner/Banner'
import Card from './Components/Card/Card'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Detailed from './Components/Detailed/Detailed';
import History from './Components/History/History';
import Profile from './Components/Profile/Profile';

const sampleCenter = {
  id: 1,
  name: "CleanRide Downtown",
  location: "123 Main Street, Downtown",
  rating: 4.8,
  reviews: 245,
  hours: "8:00 AM - 8:00 PM",
  phone: "+91 234-567-8901",
  distance: "2.3 km",
  services: ["Express Wash", "Full Detail", "Interior Clean"],
  price: "₹150 - ₹500",
  image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  capacity: 5,
  totalTime: "30-45 minutes",
  selectedSlot: "2:00 PM - 2:30 PM"
};

export default function App() {
  return (
   <Router>
     <Routes>
        <Route path='/' element={
          <>
            <NavBar />
            <Banner />
            <Card />
          </>
        } />
        <Route path='/Details' element={
          <>
            <NavBar/>
            <Detailed/>
          </>
        } />
        <Route path='/History' element={
          <>
            <NavBar/>
            <History/>
          </>
        } />
        <Route path='/Profile' element={
          <>
            <NavBar/>
            <Profile/>
          </>
        } />
      </Routes>

        
    </Router>
  )
}