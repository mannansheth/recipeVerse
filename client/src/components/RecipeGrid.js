"use client"

import { useState, useEffect, useCallback } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { mockRecipes } from "../data/mockRecipes"
import "./RecipeGrid.css"
import InfiniteScroll from "react-infinite-scroll-component"


function RecipeGrid() {
  const [searchParams] = useSearchParams()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])

  // Memoize the filter function to prevent unnecessary re-renders
  const filterRecipes = useCallback(() => {
    try {
      // Simulate API call with delay
      setLoading(true)

      // Filter recipes based on search params
      let filteredRecipes = [...mockRecipes]

      const query = searchParams.get("query")
      if (query) {
        const searchTerm = query.toLowerCase()
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(searchTerm) || recipe.description.toLowerCase().includes(searchTerm),
        )
      }

      const cuisines = searchParams.getAll("cuisine")
      if (cuisines.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => cuisines.includes(recipe.cuisine))
      }

      const diets = searchParams.getAll("diet")
      if (diets.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => diets.some((diet) => recipe.tags.includes(diet)))
      }

      const minTime = Number.parseInt(searchParams.get("minTime") || "0")
      const maxTime = Number.parseInt(searchParams.get("maxTime") || "180")
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.cookingTimeMinutes >= minTime && recipe.cookingTimeMinutes <= maxTime,
      )

      setRecipes(filteredRecipes)
      setLoading(false)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // Add a small delay to prevent UI jank
    const timer = setTimeout(() => {
      filterRecipes()
    }, 300)

    return () => clearTimeout(timer)
  }, [filterRecipes])

  const toggleFavorite = (e, recipeId) => {
    e.preventDefault()
    e.stopPropagation()

    setFavorites((prev) => {
      const newFavorites = prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]

      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(newFavorites))

      return newFavorites
    })
  }

  if (loading) {
    return <p className="recipes-loading">Loading recipes...</p>
  }

  if (error) {
    return <p className="recipes-error">Error loading recipes: {error.message}</p>
  }

  if (recipes.length === 0) {
    return (
      <div className="no-recipes">
        <h3 className="no-recipes-title">No recipes found</h3>
        <p className="no-recipes-message">Try adjusting your filters to find more recipes.</p>
        <Link to="/recipes" className="button primary">
          Clear Filters
        </Link>
      </div>
    )
  }

  return (
    <div className="recipe-grid">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  )
}

function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  return (
    <div className="recipe-card">
      <Link to={`/recipes/${recipe.id}`} className="recipe-card-link">
        <div className="recipe-image-container">
          <img src={recipe.image || `/placeholder.jpg`} alt={recipe.title} className="recipe-image" />
          <button
            className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
            onClick={(e) => onToggleFavorite(e, recipe.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
        <div className="recipe-content">
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-description">{recipe.description}</p>
          <div className="recipe-meta">
            <span className="recipe-time">
              <span className="recipe-time-icon">⏱️</span>
              <span>{recipe.cookingTimeMinutes} min</span>
            </span>
          </div>
        </div>
        <div className="recipe-footer">
          <span className="recipe-tag">{recipe.cuisine}</span>
          {recipe.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="recipe-tag secondary">
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </div>
  )
}

export default RecipeGrid

