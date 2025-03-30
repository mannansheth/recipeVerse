"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import "./Navbar.css"
import { FaAccessibleIcon, FaAsymmetrik, FaHeading, FaHeadSideCough, FaHeart, FaIcons, FaPersonRifle, FaUser } from "react-icons/fa6"

function Navbar( {isLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Recipes", path: "/recipes" },
    { name: "Create", path: "/create" },
    { name: "About", path: "/about" },
  ]

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="navbar-logo-link">
            <img src={`/assets/logo_light1.png`} className='navbar-img' style={theme==='dark' ? {filter:'invert()'} : {filter:'none'}}></img>
            {/* <img src='/assets/logo.jpg' className="navbar-img"></img> */}
            {/* <span className="navbar-logo-text">RecipeVerse</span> */}
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="navbar-nav desktop">
          <ul className="navbar-nav-list">
            {navItems.map((item) => (
              <li key={item.name} className="navbar-nav-item">
                <Link to={item.path} className={`navbar-nav-link ${location.pathname === item.path ? "active" : ""}`}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <button
              className="theme-toggle-button icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {isLoggedIn ? (
              <>
                <Link to="/wishlist" className="navbar-profile-button">
                  
                  <span className='navbar-profile-icon icon'><FaHeart></FaHeart></span>
                  <span className="sr-only">Wishlist</span>
                </Link>
                <Link to="/profile" className="navbar-profile-button">
                  
                  <span className="navbar-profile-icon icon"><FaUser ></FaUser></span>
                  <span className="sr-only">Profile</span>
                </Link>
              </>
            ) : (
              <div className="navbar-auth-buttons">
                <Link to="/auth" className="button secondary">
                  Login
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="navbar-mobile-controls">
          <button
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button className="menu-toggle-button" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-menu-nav">
            <ul className="mobile-menu-nav-list">
              {navItems.map((item) => (
                <li key={item.name} className="mobile-menu-nav-item">
                  <Link
                    to={item.path}
                    className={`mobile-menu-nav-link ${location.pathname === item.path ? "active" : ""}`}
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mobile-menu-auth">
              {isLoggedIn ? (
                <Link to="/profile" className="button primary" onClick={toggleMenu}>
                  Profile
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="button secondary" onClick={toggleMenu}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar

