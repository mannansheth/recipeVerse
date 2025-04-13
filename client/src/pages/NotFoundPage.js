"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./NotFoundPage.css"
import { FaHome, FaSearch, FaUtensils } from "react-icons/fa"

const NotFoundPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [recipeIdeas, setRecipeIdeas] = useState([])
  const [showIdeas, setShowIdeas] = useState(false)

  // List of fun recipe ideas to show when the pot is "stirred"
  const allRecipeIdeas = [
    "Chocolate Chip Cookies",
    "Spaghetti Carbonara",
    "Chicken Tikka Masala",
    "Vegetable Stir Fry",
    "Banana Bread",
    "Beef Tacos",
    "Greek Salad",
    "Mushroom Risotto",
    "Apple Pie",
    "Vegetable Curry",
    "Pancakes",
    "Grilled Cheese Sandwich",
  ]

  // Simulate "stirring the pot" to find recipe ideas
  const stirThePot = () => {
    setShowIdeas(true)
    // Randomly select 3 recipe ideas
    const shuffled = [...allRecipeIdeas].sort(() => 0.5 - Math.random())
    setRecipeIdeas(shuffled.slice(0, 3))
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // In a real app, this would redirect to search results
      window.location.href = `/recipes?query=${encodeURIComponent(searchQuery)}`
    }
  }

  // Steam animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const steamElements = document.querySelectorAll(".steam")
      steamElements.forEach((steam) => {
        steam.style.opacity = Math.random() * 0.5 + 0.3
        steam.style.transform = `translateY(-${Math.random() * 10 + 5}px) translateX(${
          Math.random() * 10 - 5
        }px) scale(${Math.random() * 0.5 + 0.8})`
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Oops! This recipe seems to be missing</h2>
          <p className="not-found-message">
            We've stirred and stirred, but couldn't find the page you're looking for. It might have been moved, deleted,
            or never existed in the first place.
          </p>

          <div className="cooking-pot-container">
            <div className="cooking-pot">
              <div className="pot-lid"></div>
              <div className="pot-body">
                <div className="pot-handle left"></div>
                <div className="pot-handle right"></div>
                {/* Steam elements */}
                <div className="steam steam-1"></div>
                <div className="steam steam-2"></div>
                <div className="steam steam-3"></div>
                <div className="steam steam-4"></div>
              </div>
              <div className="pot-base"></div>
            </div>

            <button className="stir-button" onClick={stirThePot}>
              <FaUtensils className="stir-icon" />
              Stir the pot
            </button>
          </div>

          {showIdeas && (
            <div className="recipe-ideas">
              <h3>Maybe you'd like to try one of these recipes instead?</h3>
              <ul className="ideas-list">
                {recipeIdeas.map((idea, index) => (
                  <li key={index}>
                    <Link to={`/recipes?query=${encodeURIComponent(idea)}`}>{idea}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="search-container">
            <h3>Looking for something specific?</h3>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </form>
          </div>

          <div className="navigation-options">
            <Link to="/" className="home-button">
              <FaHome className="home-icon" />
              Back to Home
            </Link>
            <Link to="/recipes" className="recipes-button">
              <FaUtensils className="recipes-icon" />
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
