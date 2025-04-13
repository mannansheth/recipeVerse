"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./RecipeCreator.css"
import axios from "axios"
import { toast } from "react-toastify"

const RecipeCreator = ({isLoggedIn}) => {
  
  const navigate = useNavigate()
  const [ingredients, setIngredients] = useState([])
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [dietaryPreference, setDietaryPreference] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [error, setError] = useState(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const API_KEY = process.env.REACT_APP_PEXELS_API_KEY
  const IP_ADDRESS = process.env.REACT_APP_IP_ADDRESS

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()])
      setCurrentIngredient("")
    }
  }

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((i) => i !== ingredient))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addIngredient()
    }
  }
  useEffect(() => {
    if (localStorage.getItem("recipeStatus") === 'generating') {
      setIsGenerating(true)
    }
    setGeneratedRecipe(JSON.parse(localStorage.getItem("recipe")))
    localStorage.removeItem("recipe")
    localStorage.removeItem("recipeStatus")
  }, [])
  useEffect(() => {
    if (generatedRecipe) {
      fetchImageURL(generatedRecipe.Name)
    }
  }, [generatedRecipe])
  const fetchImageURL = async (name) => {
    try {
      const response = await axios.get('https://api.pexels.com/v1/search', {
        headers: {
          Authorization: API_KEY,
        },
        params: {
          query: name,
          per_page:2,
        }
      });
      const curr_recipe = generatedRecipe;
      curr_recipe['image'] = response.data.photos[0];
      setGeneratedRecipe(curr_recipe)
      localStorage.setItem('recipe', JSON.stringify(curr_recipe))
      setIsImageLoading(false)
    } catch (error) {
      console.error('Error fetching image: ', error);
    }
  }
  const fetchVideoByInstructions = async () => {
    toast.info("Generating video. This usually takes upto 30 seconds.")
    try {
      const response = await axios.post(`http://${IP_ADDRESS}:5001/generate-audio`, {
        instructions : generatedRecipe.RecipeInstructions,
        imageURL:generatedRecipe.image?.src.original,
        name: generatedRecipe.Name
      })

      toast.success("Video generated! Click on view full recipe.")
      console.log(response.data);
      
      const curr_recipe = generatedRecipe;
      curr_recipe['videoURL'] = response.data;
      setGeneratedRecipe(curr_recipe) 
      localStorage.setItem('recipe', JSON.stringify(curr_recipe))
    } catch (err) {
      console.error("Error fetching audio: ", err);
    }
  }
  const handleGenerateRecipe = async () => {
    localStorage.removeItem("recipe")
    if (ingredients.length === 0) return
    setIsGenerating(true)
    localStorage.setItem("recipeStatus", 'generating')
    setError(null)
    toast.info("Generating a specialized recipe for you. This may take upto 1 minute.")
    try {
      const response = await axios.post(`http://${IP_ADDRESS}:5001/get-recipe`, {
        ingredients
      })  
      setGeneratedRecipe(response.data)
      localStorage.setItem("recipe", (JSON.stringify(response.data)))
      localStorage.setItem('recipeStatus', 'ready')
    } catch (error) {
      console.error("Error generating recipe:", error)
      setError("Failed to generate recipe. Please try again.", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveRecipe = async () => {
    if (!isLoggedIn) {
      toast.error('You need to login first. Redirecting...');
      setTimeout(() => {
        navigate('/auth', {state: {location: '/generate'}})
      }, 2500)
      return;
    }
    const recipe = JSON.stringify(generatedRecipe)
    try {
      const response = await axios.post(`http://${IP_ADDRESS}:5001/add-AI-recipe`, {recipe}, {
        headers : {
          Authorization: `Bearer: ${localStorage.getItem("token")}`
        }
      })
      toast.success('Recipe saved succesfully. Go to your profile to view it.');
    } catch (err) {
      console.error(err);
    }
  }
  const clearRecipe = () => {
    localStorage.removeItem("recipe");
    localStorage.removeItem("recipeStatus")
    setTimeout(() => {
      window.location.reload()
    }, 100) 
  }

  const handleViewFullRecipe = () => {
    navigate('/recipes/generated', {state: { generatedRecipe }})
  }
  return (
    <div className="recipe-creator">
      
      <div className="recipe-creator-grid">
        <div className="recipe-creator-inputs">
          <h2 className="recipe-creator-title">Your Ingredients</h2>
          <div className="recipe-creator-form">
            <div className="ingredient-input-container">
              <input
                type="text"
                placeholder="Add an ingredient (e.g., chicken, rice, tomatoes)"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyDown={handleKeyDown}
                className="ingredient-input"
              />
              <button onClick={addIngredient} disabled={!currentIngredient.trim()} className="add-ingredient-button">
                Add
              </button>
            </div>

            <div className="ingredients-list">
              {ingredients.length === 0 ? (
                <p className="no-ingredients-message">Add some ingredients to get started</p>
              ) : (
                ingredients.map((ingredient) => (
                  <div key={ingredient} className="ingredient-tag">
                    {ingredient}
                    <button onClick={() => removeIngredient(ingredient)} className="remove-ingredient-button">
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="recipe-options">
              <div className="recipe-option">
                <label htmlFor="dietary-preference" className="recipe-option-label">
                  Dietary Preference (Optional)
                </label>
                <select
                  id="dietary-preference"
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                  className="recipe-select"
                >
                  <option value="">Select a preference</option>
                  <option value="none">No preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="dairy-free">Dairy-Free</option>
                  <option value="keto">Keto</option>
                  <option value="low-carb">Low-Carb</option>
                </select>
              </div>

              <div className="recipe-option">
                <label htmlFor="additional-notes" className="recipe-option-label">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="additional-notes"
                  placeholder="Any specific preferences or constraints?"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                  className="recipe-textarea"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateRecipe}
              disabled={ingredients.length === 0 || isGenerating}
              className="generate-button"
            >
              {isGenerating ? "Generating Recipe..." : "Generate Recipe"}
            </button>

            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
        
        <div className="recipe-creator-result">
          {isGenerating ? 
          <>

            <button onClick={() => localStorage.removeItem("recipeStatus")}>Stop generating</button>
            <iframe
            src='/FruitNinja/index.html'
            width="100%"
            height="700px"
            style={{ border: "none" }}
            sandbox="allow-scripts allow-same-origin"
            ></iframe>
            </>
          :
            <>
            <h2 className="recipe-creator-title">Generated Recipe</h2>
            
          {generatedRecipe ? (
            <div className="generated-recipe">
              <h3 className="generated-recipe-title">{generatedRecipe.Name}</h3>
              <p className="generated-recipe-description">{generatedRecipe.Description}</p>
              {!isImageLoading ? 
              <img src={generatedRecipe.image?.src.tiny} className='generated-recipe-image'/>
                : null
            }
              

              <div className="generated-recipe-section">
                <h4 className="generated-recipe-section-title">Ingredients:</h4>
                <ul className="generated-recipe-list">
                  {generatedRecipe.Ingredients.map((ingredient, index) => (
                    <li key={index} className="generated-recipe-list-item">
                      {ingredient.name} {ingredient.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="generated-recipe-section">
                <h4 className="generated-recipe-section-title">Instructions:</h4>
                <ol className="generated-recipe-list numbered">
                  {generatedRecipe.RecipeInstructions.map((step, index) => (
                    <li key={index} className="generated-recipe-list-item">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              
              <div className="generated-recipe-meta">
                <div className="generated-recipe-meta-item">
                <span className="meta-label">Diet:</span>
                <span className="meta-value">
                {generatedRecipe.Diet === 'Vegan' ? "🌱" : generatedRecipe.Diet === 'Vegetarian' ? "🟢" : "🔴"}
              </span>
                </div>
                <div className="generated-recipe-meta-item">
                  <span className="meta-label">Cooking Time:</span>
                  <span className="meta-value">{generatedRecipe.TotalTime.replace("PT", "")}</span>
                </div>
                <div className="generated-recipe-meta-item">
                  <span className="meta-label">Servings:</span>
                  <span className="meta-value">{generatedRecipe.RecipeServings}</span>
                </div>
                <div className="generated-recipe-meta-item">
                  <span className="meta-label">Cuisine:</span>
                  <span className="meta-value">{generatedRecipe.RecipeCategory}</span>
                </div>
              </div>

              <button onClick={handleSaveRecipe} className="save-recipe-button">
                Save Recipe
              </button>
              <button onClick={clearRecipe} className='save-recipe-button'>Clear recipe</button>
              <button onClick={handleViewFullRecipe} className='save-recipe-button'>View full recipe</button>
              <button onClick={fetchVideoByInstructions} className="save-recipe-button">🔊 Generate Video</button>

            </div>
          ) : (
            <div className="no-recipe-placeholder">
              <div className="placeholder-icon">👨‍🍳</div>
              <h3 className="placeholder-title">No Recipe Generated Yet</h3>
              <p className="placeholder-message">
                Add your ingredients and click "Generate Recipe" to create a custom recipe with what you have on hand.
              </p>
            </div>
          )}
            </>
          }
          
        </div>
      </div>
    </div>
  )
}

export default RecipeCreator

