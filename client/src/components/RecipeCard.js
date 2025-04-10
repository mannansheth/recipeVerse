import { Link } from "react-router-dom"

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite }) => {
  const convertToMin = (time) => {
    let hoursMatch = time.match(/(\d+)H/) 
    let minsMatch = time.match(/(\d+)M/)
    let hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    let minutes = minsMatch ? parseInt(minsMatch[1]) : 0;
    return hours * 60 + minutes
  }
  return (
    <div className="recipe-card">
      <Link to={`/recipes/${recipe.RecipeId}`} className="recipe-card-link">
        <div className="recipe-image-container">
          <img src={recipe.Images[0].replace(/^"|"$/g, "").replace(/\\\//g, "/") || `/assets/placeholder.jpg`} alt={recipe.Name} className="recipe-image" />
          <button
            className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
            onClick={(e) => onToggleFavorite(e, recipe.RecipeId)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
        <div className="recipe-content">
          <h3 className="recipe-title">{recipe.Name}</h3>
          {recipe.Description.length > 100 ? 
          <p className="recipe-description">
            {recipe.Description.slice(0,100)}...
          </p> : 
          <p className="recipe-description">
            {recipe.Description}
            </p>
          }
          <div className="recipe-meta">
            <span className="recipe-time">
              <span className="recipe-time-icon">⏱️</span>
              <span>{convertToMin(recipe.TotalTime.replace('PT', ''))} min</span>
            </span>
          </div>
        </div>
        <div className="recipe-footer">
          <span>
            {recipe.Diet === 'Vegan' ? "🌱" : recipe.Diet === 'Vegetarian' ? "🟢" : "🔴"}
          </span>
          <span className="recipe-tag">{recipe.RecipeCategory}</span>
          {recipe.Keywords ? recipe.Keywords.slice(0, 2).map((tag) => (
            <span key={tag} className="recipe-tag secondary">
              {tag}
            </span>
          )): null}
        </div>
      </Link>
    </div>
  )
}
export default RecipeCard;