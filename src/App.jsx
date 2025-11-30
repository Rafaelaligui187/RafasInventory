import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Navbar and Footer
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Products from './pages/Products'
import About from './pages/About'
import Login from './Login/Login'
import Signup from './Signup/Signup'
import Reports from './pages/Reports'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import Accountmanage from './pages/accountmanage'

// Layout component to handle Navbar visibility
const Layout = ({ children }) => {
  const location = useLocation()
  const hideNavbar = location.pathname === '/' || location.pathname === '/signup' // hide on Login and Signup

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      <Footer />
    </>
  )
}

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />       
          <Route path="/products" element={<Products />} />   
          <Route path="/about" element={<About />} />  
          <Route path="/signup" element={<Signup />} /> 
          <Route path="/reports" element={<Reports />} />
          <Route path="/history" element={<History />} />
          <Route path="/accountmanage" element={<Accountmanage />} />   
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
