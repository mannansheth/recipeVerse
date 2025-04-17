
import { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import "./RecipeDetailsPage.css"
import recipes from '../data/recipes.json';
import reviews_data from '../data/reviews.json'
import { FaStar, FaUserCheck, FaUserSecret } from "react-icons/fa6";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import NutritionInfo from "../components/NutritionInfo";
const RecipeDetailsPage = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userInfo } = useContext(UserContext)
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("ingredients")
  const [reviews, setReviews] = useState([])
  const [hover, setHover] = useState(0)
  const [rating, setRating] = useState(null)
  const [reviewText, setReviewText] = useState("")
  const [viewTab, setViewTab] = useState("image")
  const IP_ADDRESS = process.env.REACT_APP_IP_ADDRESS
  useEffect(() => {
    const id_in_int = Number(id)
    setRecipe(location.state?.generatedRecipe || recipes.find(r => r.RecipeId === id_in_int) || [])
    
  }, [])
  useEffect(() => {
    if (recipe) {
      setLoading(false)
    }
  }, [recipe])
  const fetchVideoByInstructions = async () => {
      toast.info("Generating video. This usually takes upto 30 seconds.")
      try {
        const response = await axios.post(`http://${IP_ADDRESS}:5001/generate-audio`, {
          instructions : recipe.RecipeInstructions,
          imageURL:recipe.image?.src.original,
          name: recipe.Name
        })
        toast.success("Video generated! Click on view full recipe.")
        const curr_recipe = recipe;
        curr_recipe['videoURL'] = response.data;
        console.log(curr_recipe);
        
        setRecipe(curr_recipe) 
        localStorage.setItem('recipe', JSON.stringify(curr_recipe))
      } catch (err) {
        console.error("Error fetching audio: ", err);
      }
    }
  useEffect(() => {
    if (recipe) {
      const favs = JSON.parse(localStorage.getItem("favorites"))
      if (favs !== null) {
        setIsFavorite(favs.includes(recipe.RecipeId))
      }
    }
  }, [recipe])

  useEffect(() => {
    if (recipe) {
      if (reviews_data[recipe.RecipeId] !== undefined) {
        const sortedReviews = reviews_data[recipe.RecipeId].sort((a, b) => new Date(b.DateSubmitted) - new Date(a.DateSubmitted));
        setReviews(sortedReviews.slice(0,10))
      }
    }
  }, [recipe])
  if (loading) {
    return (
      <div className="recipe-loading">
        <div className="recipe-loading-spinner"></div>
        <p>Loading recipe...</p>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="recipe-error">
        <h2>Recipe not found</h2>
        <p>We couldn't find the recipe you're looking for.</p>
        <Link to="/recipes" className="button primary">
          Browse Recipes
        </Link>
      </div>
    )
  }
  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    const minutes = timeString.replace("PT", "").replace("M", "min").replace('H', 'hr')
    // return minutes.includes('minutes') ? minutes :
    //   minutes.includes('h') ? minutes
    //   : `${minutes} minutes`
    return minutes
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    const favs = JSON.parse(localStorage.getItem("favorites"))
    var new_favs = []
    if (favs === null) {
      new_favs = [recipe.RecipeId]
    } else {
      new_favs = favs.includes(recipe.RecipeId) ? favs.filter(n => n!== recipe.RecipeId) : [...favs, recipe.RecipeId]
    }
    localStorage.setItem("favorites", JSON.stringify(new_favs))
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast.error('You need to login first. Redirecting...')
      setTimeout(() => {
        navigate('/auth')
      }, 3000)
      return
    }
    const reviewDeets = {
      AuthorName: userInfo.username,
      Rating: rating,
      Review: reviewText,
      DateSubmitted: new Date().toISOString()
    }
    setReviews(prev => [reviewDeets, ...prev])
    try {
      const response = await axios.post(`http://${IP_ADDRESS}:5001/add-review/${recipe.RecipeId}`, reviewDeets, {
        headers: {
          Authorization: `Bearer: ${localStorage.getItem("token")}`
        }
      })
      toast.success("Review added!")
    } catch (err) {
      console.error("Error: ", err);
    }
  }
  return (
    <div className="recipe-page-page">
      <div className="recipe-page-header">
        <Link to="/recipes" className="back-link">
          <i className="icon-arrow-left"></i>
          <span>Back to recipes</span>
        </Link>

        <div className="recipe-page-actions">
          <button className="recipe-page-button outline" onClick={() => window.print()}>
            <i className="icon-printer"></i>
            <span>Print</span>
          </button>
          <button className="recipe-page-button outline">
            <i className="icon-share"></i>
            <span>Share</span>
          </button>
          {recipe.RecipeId &&
            <button className={`recipe-page-button ${isFavorite ? "primary" : "outline"}`} onClick={toggleFavorite}>
              <i className={`icon-heart ${isFavorite ? "filled" : ""}`}></i>
              <span>{isFavorite ? "Favorited" : "Favorite"}</span>
            </button>
          }
        </div>
      </div>

      <div className="recipe-page-content">
        <div className="recipe-page-main">
          <div className="recipe-page-title-section">
            <h1 className="recipe-page-title">{recipe.Name}</h1>
            <div className="recipe-page-meta">
              <div className="recipe-page-rating">
                <i className="icon-star filled"></i>
                <span>
                  {recipe.AggregatedRating} ({reviews.length} reviews)
                </span>
              </div>
              <div className="recipe-page-category">
                <span className="badge">{recipe.RecipeCategory}</span>
                {recipe.Diet && <span className="badge outline">{recipe.Diet}</span>}
              </div>
            </div>
            <p className="recipe-page-description">{recipe.Description}</p>
          </div>
          {!recipe.RecipeId &&
            <div className="recipe-page-tabs-list">
            <button
              className={`tab-button ${viewTab === "image" ? "active" : ""}`}
              onClick={() => setViewTab("image")}
            >
              Image
            </button>
            <button
              className={`tab-button ${viewTab === "video" ? "active" : ""}`}
              onClick={() => setViewTab("video")}
            >
              Video
            </button>
          </div>
          }
          
          <div className="recipe-page-image-container">
            {!recipe.RecipeId ?
              viewTab === 'image' ? (
                <img
                src={recipe.image ? recipe.image.src.medium
                  : "/assets/placeholder.jpg"}
                  alt={recipe.Name}
                  className="recipe-page-image"
                />
                ) 
                : 
                viewTab === 'video' && recipe.videoURL ? 
                  <video width="100%" controls autoPlay muted={false}>
                    <source src={recipe.videoURL} type="video/mp4" />
                    Your browser does not support the video tag
                  </video>
                : <button className="button" onClick={fetchVideoByInstructions}> Click here to generate video</button>
             :
                <img
                src={recipe.RecipeId ? recipe.Images[0]?.replace(/"/g, "") 
                  : "/assets/placeholder.jpg"}
                alt={recipe.Name}
                className="recipe-page-image"
              />
            }
            
          </div>

          <div className="recipe-page-quick-info">
            <div className="info-card">
              <i className="icon-clock"></i>
              <div className="info-content">
                <h3>Prep Time</h3>
                <p>{formatTime(recipe.PrepTime)}</p>
              </div>
            </div>
            <div className="info-card">
              <i className="icon-clock"></i>
              <div className="info-content">
                <h3>Cook Time</h3>
                <p>{formatTime(recipe.CookTime)}</p>
              </div>
            </div>
            <div className="info-card">
              <i className="icon-clock"></i>
              <div className="info-content">
                <h3>Total Time</h3>
                <p>{formatTime(recipe.TotalTime)}</p>
              </div>
            </div>
            <div className="info-card">
              <i className="icon-users"></i>
              <div className="info-content">
                <h3>Servings</h3>
                <p>{recipe.RecipeServings || "Not specified"}</p>
              </div>
            </div>
          </div>

          <div className="recipe-page-details">
            <div className="recipe-page-tabs">
              <div className="recipe-page-tabs-list">
                <button
                  className={`tab-button ${activeTab === "ingredients" ? "active" : ""}`}
                  onClick={() => setActiveTab("ingredients")}
                >
                  Ingredients
                </button>
                <button
                  className={`tab-button ${activeTab === "instructions" ? "active" : ""}`}
                  onClick={() => setActiveTab("instructions")}
                >
                  Instructions
                </button>
                <button
                  className={`tab-button ${activeTab === "nutrition" ? "active" : ""}`}
                  onClick={() => setActiveTab("nutrition")}
                >
                  Nutrition
                </button>
                <button
                  className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
              </div>

              <div className="recipe-page-tab-content">
                {activeTab === "ingredients" && (
                  <div>
                    <h2>Ingredients</h2>
                    <ul className="ingredients-list">
                      {recipe.Ingredients?.map((ingredient, index) => (
                        <li key={index} className="ingredient-item">
                          <span className="ingredient-quantity">{ingredient.quantity}</span>
                          <span className="ingredient-name">{ingredient.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "instructions" && (
                  <div>
                    <h2>Instructions</h2>
                    <ol className="instructions-list">
                      {recipe.RecipeInstructions.map((instruction, index) => (
                        <li key={index} className="instruction-item">
                          <div className="instruction-number">{index + 1}</div>
                          <div className="instruction-text">{instruction}</div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {activeTab === "nutrition" && (
                  // <div>
                  //   <h2>Nutrition Information</h2>
                  //   <div className="nutrition-grid">
                  //     <div className="nutrition-item">
                  //       <h3>Calories</h3>
                  //       <p>{recipe.Calories} kcal</p>
                  //     </div>
                  //     <div className="nutrition-item">
                  //       <h3>Fat</h3>
                  //       <p>{recipe.FatContent}g</p>
                  //     </div>
                  //     <div className="nutrition-item">
                  //       <h3>Saturated Fat</h3>
                  //       <p>{recipe.SaturatedFatContent}g</p>
                  //     </div>
                  //     <div className="nutrition-item">
                  //       <h3>Cholesterol</h3>
                  //       <p>{recipe.CholesterolContent}mg</p>
                  //     </div>
                  //     <div className="nutrition-item">
                  //       <h3>Sodium</h3>
                  //       <p>{recipe.SodiumContent}mg</p>
                  //     </div>
                  //     <div className="nutrition-item">
                  //       <h3>Carbohydrates</h3>
                  //       <p>{recipe.CarbohydrateContent}g</p>
                  //     </div>
                  //     <div className="nutrition-item">
                  //       <h3>Fiber</h3>
                  //       <p>{recipe.FiberContent}g</p>
                  //     </div>
                  //     <div className="nutrition-item">
                  //       <h3>Sugar</h3>
                  //       <p>{recipe.SugarContent}g</p>
                  //     </div>
                  //     <div className="nutrition-item">
                  //       <h3>Protein</h3>
                  //       <p>{recipe.ProteinContent}g</p>
                  //     </div>
                  //   </div>
                  // </div>
                  <NutritionInfo macros={recipe} />
                )}

                  {activeTab === "reviews" && (
                  <div>
                    <div className="add-review-section">
                      <h3>Add Your Review</h3>
                      <form className="review-form">
                        <div className="form-group">
                          <label htmlFor="review-text">Your Review</label>
                          <textarea
                            id="review-text"
                            placeholder="Share your experience with this recipe"
                            className="form-textarea"
                            rows="4"
                            value={reviewText}
                            onChange={e => setReviewText(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label>Your Rating</label>
                          <div className="rating-input">
                            {[...Array(5)].map((_, index) => {
                              const starValue = index + 1;
                              return (
                                <FaStar
                                  key={starValue}
                                  className="icon-star"
                                  size={24}
                                  color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                  onMouseEnter={() => setHover(starValue)}
                                  onMouseLeave={() => setHover(0)}
                                  onClick={() => setRating(starValue)}
                                />
                              );
                            })}
                          </div>
                        </div>
                        <button disabled={!rating || !reviewText.trim()} className="recipe-page-button primary submit-review-button" onClick={submitReview}>
                          Submit Review
                        </button>
                      </form>
                    </div>
                    <h2>Reviews ({reviews.length})</h2>
                    <div className="reviews-container">
                      {reviews.map((review) => (
                        <div key={review.ReviewId} className="review-item">
                          <div className="review-header">
                            <div className='review-user'>
                              <div className="review-author">{review.AuthorName}</div>
                              {review.AuthorName === userInfo.username ? 
                                <span className='is-user-review'>
                                  <FaUserSecret></FaUserSecret>
                                </span>
                                
                              : null}
                            </div>
                            <div className="review-date">{new Date(review.DateSubmitted).toLocaleDateString()}</div>
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`icon-star ${i < review.Rating ? "filled" : ""}`}></i>
                            ))}
                          </div>
                          <p className="review-text">{review.Review}</p>
                        </div>
                      ))}
                    </div>

                    
                  </div>
                )}  
              </div>
            </div>
          </div>
        </div>

        <div className="recipe-page-sidebar">
          <div className="sidebar-section keywords-section">
            <h3>Keywords</h3>
            <div className="keywords-container">
              {recipe.Keywords?.map((keyword, index) => (
                <span key={index} className="badge secondary keyword-badge">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailsPage

