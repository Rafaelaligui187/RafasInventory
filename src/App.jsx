import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Navbar and Footer
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Login from './Login/Login'
import Signup from './Signup/Signup' // if you add signup later

const App = () => {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      {/* Page content */}
      <div> 
        <Routes>
          <Route path="/" element={<Login />} />       
          <Route path="/home" element={<Home />} />   
          <Route path="/about" element={<About />} />  
          <Route path="/signup" element={<Signup />} /> 
        </Routes>
      </div>

      {/* Footer always visible */}
      <Footer />
    </Router>
  )
}

export default App
