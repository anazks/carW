
import NavBar from './Components/NavBar/NavBar'
import Banner from './Components/Banner/Banner'
import Card from './Components/Card/Card'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Detailed from './Components/Detailed/Detailed';
import History from './Components/History/History';
import Profile from './Components/Profile/Profile';

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