import React, { useContext } from 'react'
import { FaEnvelope, FaFacebook, FaInstagram, FaPhone, FaWhatsapp } from 'react-icons/fa6'
import { NavLink, Link } from 'react-router'
import './Footer.css'
import { useTheme } from '../contexts/ThemeContext'

const Footer = () => {
  const { theme } = useTheme()
  return (
    <footer className='footer'>
      <div className='footer-info'>
        <div className='footer-left'>
          <div className='footer-logo-title'>
          <img src={`/assets/logo_light1.png`} className='footer-logo' style={theme==='dark' ? {filter:'invert()'} : {filter:'none'}}></img>
          </div>
          
        </div>
        <div className='footer-middle'>
        <div className='footer-aboutus'>
            <h3>About us</h3>
            <h5>RecipeVerse – Your AI-powered recipe companion, offering smart cooking suggestions and personalized meal ideas tailored to your ingredients.</h5>
          </div>
        </div>
        <div className='footer-right'>
        <h3>Contact Us</h3>
          <div className='footer-links'>
            <a href='https://www.instagram.com/ownessentials.in/' target='_blank'><FaInstagram className='footer-icon'></FaInstagram></a>
            <a><FaWhatsapp className='footer-icon'></FaWhatsapp></a>
            <a href='mailto:ownessentials4you@gmail.com'><FaEnvelope className='footer-icon'></FaEnvelope></a>
            <a href='tel:+8104917490'><FaPhone className='footer-icon'></FaPhone></a>
            <a><FaFacebook className='footer-icon'></FaFacebook></a>
            
          </div>
          <div className="footer-links">
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-link-list">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/recipes" className="footer-link">
                  Recipes
                </Link>
              </li>
              <li>
                <Link to="/create" className="footer-link">
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr></hr>
      <h4>Copyright &copy; 2025 RecipeVerse</h4>
    </footer>
  )
}

export default Footer
