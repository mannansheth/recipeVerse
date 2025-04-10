import { useState, useEffect } from "react"
import RecipeFilters from "../components/RecipeFilters"
import Recipes from '../components/Recipes'
import "./RecipesPage.css"

function RecipesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <div className="container recipes-error">
        <h1>Error Loading Recipes</h1>
        <p>{error.message}</p>
        <button className="button primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="recipes-page">
      <div className="container">
        <h1 className="recipes-title">Discover Recipes</h1>

        <div className="recipes-layout">
          <aside className="recipes-sidebar">
            <RecipeFilters />
          </aside>

          <div className="recipes-content">{loading ? <RecipeGridSkeleton /> : <Recipes />}</div>
        </div>
      </div>
    </div>
  )
}

function RecipeGridSkeleton() {
  return (
    <div className="recipe-grid-skeleton">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="recipe-card-skeleton">
            <div className="recipe-image-skeleton"></div>
            <div className="recipe-title-skeleton"></div>
            <div className="recipe-description-skeleton"></div>
            <div className="recipe-tags-skeleton">
              <div className="recipe-tag-skeleton"></div>
              <div className="recipe-tag-skeleton"></div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default RecipesPage

