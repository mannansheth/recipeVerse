import { Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import RecipesPage from "./pages/RecipesPage"
// import RecipeDetailPage from "./pages/RecipeDetailPage"
import CreateRecipePage from "./pages/CreateRecipePage"
// import LoginPage from "./pages/LoginPage"
// import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
// import AboutPage from "./pages/AboutPage"
// import NotFoundPage from "./pages/NotFoundPage"
import { ToastContainer } from "react-toastify"
import "./App.css"
import Login from "./pages/Login"
import { useEffect, useState } from "react"
import { UserProvider } from "./contexts/UserContext"
import UseCheckStatus from "./hooks/UseCheckStatus"
import ScrollToTop from "./components/ScrollToTop"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  if (localStorage.getItem("recipe") === null) {
    UseCheckStatus();
  }
  useEffect(() => {
    const token = localStorage.getItem("token");    
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [])
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to='/auth' />
  }
  return (
    <ThemeProvider>
      <UserProvider isLoggedIn={isLoggedIn}>
        <ScrollToTop />
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            {/* <Route path="/recipes/:id" element={<RecipeDetailPage />} /> */}
            <Route path="/create" element={<CreateRecipePage />} />
            <Route path="/auth" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            
            <Route path="/profile" element={<ProtectedRoute><ProfilePage setIsLoggedIn={setIsLoggedIn} /></ProtectedRoute>} />
            {/* 
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer  position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
        </UserProvider>
    </ThemeProvider>

    
  )
}

export default App

