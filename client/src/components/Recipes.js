
import { useState, useEffect, useCallback } from "react"
import { Link, useSearchParams } from "react-router-dom"
import "./RecipeGrid.css"
import data from '../data/recipes.json'
import RecipeCard from "./RecipeCard"

const Recipes = () => {
  const [searchParams] = useSearchParams()
  const [recipes, setRecipes] = useState(data)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])

  const convertToMin = (time) => {
    let hoursMatch = time.match(/(\d+)H/) 
    let minsMatch = time.match(/(\d+)M/)
    let hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    let minutes = minsMatch ? parseInt(minsMatch[1]) : 0;
    return hours * 60 + minutes
  }
  const filterRecipes = useCallback(() => {
    try {
      setLoading(true)
      let filteredRecipes = [...data]
      const query = searchParams.get("query")
      if (query) {
        const searchTerm = query.toLowerCase()
        filteredRecipes = filteredRecipes.filter(
          (recipe) =>
            recipe.Name.toLowerCase().includes(searchTerm) || 
            recipe.Description.toLowerCase().includes(searchTerm) || 
            recipe.RecipeIngredientParts.some(ingredient => ingredient.toLowerCase().includes(searchTerm)),
        )
      }

      const categories = searchParams.getAll("cuisine")
      const isHighProtein = (recipe) => {
        if (categories.includes("High Protein")) {
            return ((parseFloat(recipe.Calories) / parseFloat(recipe.ProteinContent)) < 20)
        }
      }
      const isLowCarb = (recipe) => {
        if (categories.includes("Low Carb")) {
          return recipe.Keywords?.some(key => key.includes("Low Carb"))
        }
      }

      if (categories.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => categories.includes(recipe.RecipeCategory) || recipe.Keywords?.some(key => categories.includes(key)) || isHighProtein(recipe) || isLowCarb(recipe))
      }
      

      const diets = searchParams.getAll("diet")
      
      if (diets.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => diets.some((diet) => recipe.Diet === diet))
      }

      const minTime = Number.parseInt(searchParams.get("minTime") || "0")
      const maxTime = Number.parseInt(searchParams.get("maxTime") || "100000")
      
      filteredRecipes = filteredRecipes.filter(
        (recipe) => convertToMin(recipe.TotalTime.replace('PT', '')) >= minTime && convertToMin(recipe.TotalTime.replace('PT', '')) <= maxTime,
      )

      setRecipes(filteredRecipes)
      setLoading(false)
    } catch (err) {
      setError(err)
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    const timer = setTimeout(() => {
      filterRecipes()
    }, 300)

    return () => clearTimeout(timer)

  }, [searchParams])

  const toggleFavorite = (e, RecipeId) => {
    e.preventDefault()
    e.stopPropagation()

    setFavorites((prev) => {
      const newFavorites = prev.includes(RecipeId) ? prev.filter((id) => id !== RecipeId) : [...prev, RecipeId]
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
    <div className="recipe-grid" key="recipes">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.RecipeId}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.RecipeId)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  )
}




export default Recipes

