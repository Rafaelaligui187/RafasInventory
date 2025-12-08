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
import StockHistory from './pages/StockHistory'
import Dashboard from './pages/Dashboard'
import Accountmanage from './pages/accountmanage'
import SalesHistory from './pages/SalesHistory'

// NEW: Private Route
import PrivateRoute from "./PrivateRoute"

// Layout component to show/hide Navbar & Footer
const Layout = ({ children }) => {
  const location = useLocation()
  const hideLayout = location.pathname === '/' || location.pathname === '/signup'

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      
      {/* IF U WANT TO ENABLE FOOTER just uncomment this line*/}
      {/* {!hideLayout && <Footer />} */}      
    </>
  )
}

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route 
            path="/products" 
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />

          <Route 
            path="/about" 
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />

          <Route 
            path="/reports" 
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />

          <Route 
            path="/stockhistory" 
            element={
              <PrivateRoute>
                <StockHistory />
              </PrivateRoute>
            }
          />

          <Route 
            path="/accountmanage" 
            element={
              <PrivateRoute>
                <Accountmanage />
              </PrivateRoute>
            }
          />

          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route 
            path="/saleshistory" 
            element={
              <PrivateRoute>
                <SalesHistory />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
