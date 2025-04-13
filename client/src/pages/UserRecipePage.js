import { useEffect, useState } from "react"
import "./UserRecipePage.css"
import axios from "axios"
import { toast } from "react-toastify"
import NutritionInfo from "../components/NutritionInfo"
import Loader from "../components/Loader"
import { useLocation, useNavigate } from "react-router-dom"

const UserRecipePage = ({ isLoggedIn }) => {
  const APP_ID = process.env.REACT_APP_NUTRITIONIX_APP_ID
  const API_KEY = process.env.REACT_APP_NUTRITIONIX_API_KEY
  const IP_ADDRESS = process.env.REACT_APP_IP_ADDRESS
  const navigate = useNavigate()
  const location = useLocation()
  const [recipeName, setRecipeName] = useState("")
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }])
  const [prepTime, setPrepTime] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [totalTime, setTotalTime] = useState("")
  const [category, setCategory] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [macros, setMacros] = useState(null)
  const [isMacrosLoading, setIsMacrosLoading] = useState(false)
  const [macrosByIngredients, setMacrosByIngredients] = useState(null)
  const [nutritionViewMode, setNutritionViewMode] = useState("combined")
  const [selectedIngredient, setSelectedIngredient] = useState(null)

  const categories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Appetizer",
    "Dessert",
    "Snack",
    "Soup",
    "Salad",
    "Main Course",
    "Side Dish",
    "Beverage",
    "Baked Goods",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
  ]

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }])
  }

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients]
    newIngredients.splice(index, 1)
    setIngredients(newIngredients)
  }
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  const fetchMacros = async () => {
    var ingredients_str = ""
    ingredients.forEach((item) => {
      ingredients_str += `${item["quantity"]} ${item["name"]} `
    })
    if (ingredients_str === "  ") {
      toast.error("Please enter ingredients")
      setTimeout(() => {
        setCurrentStep(2)
      }, 100)
      return
    }
    setIsMacrosLoading(true)
    try {
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        { query: ingredients_str },
        {
          headers: {
            "x-app-id": APP_ID,
            "x-app-key": API_KEY,
            "Content-Type": "application/json",
          },
        },
      )

      extractMacros(response.data)
    } catch (error) {
      console.error("Error fetching macros: ", error)
      toast.error("Failed to fetch nutrition information. Please try again.")
      setIsMacrosLoading(false)
    }
  }

  const extractMacros = (all_details) => {
    var detailsByIngredients = []
    all_details["foods"].forEach((item) => {
      detailsByIngredients.push({
        Name: item["food_name"],
        Serving: `${item["serving_qty"]}${item["serving_unit"]}`,
        Calories: item["nf_calories"],
        FatContent: item["nf_total_fat"],
        SaturatedFatContent: item["nf_saturated_fat"],
        CholesterolContent: item["nf_cholesterol"],
        SodiumContent: item["nf_sodium"],
        CarbohydrateContent: item["nf_total_carbohydrate"],
        FiberContent: item["nf_dietary_fiber"],
        SugarContent: item["nf_sugars"],
        ProteinContent: item["nf_protein"],
      })
    })
    setMacrosByIngredients(detailsByIngredients)
    if (detailsByIngredients.length > 0) {
      setSelectedIngredient(0)
    }
  }

  useEffect(() => {
    if (macrosByIngredients) {
      setMacros({
        Calories: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.Calories || 0, 0),
          2,
        ),
        FatContent: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.FatContent || 0, 0),
          2,
        ),
        SaturatedFatContent: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.SaturatedFatContent || 0, 0),
          2,
        ),
        CholesterolContent: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.CholesterolContent || 0, 0),
          2,
        ),
        SodiumContent: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.SodiumContent || 0, 0),
          2,
        ),
        CarbohydrateContent: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.CarbohydrateContent || 0, 0),
          2,
        ),
        FiberContent: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.FiberContent || 0, 0),
          2,
        ),
        SugarContent: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.SugarContent || 0, 0),
          2,
        ),
        ProteinContent: Math.round(
          macrosByIngredients.reduce((sum, item) => sum + item.ProteinContent || 0, 0),
          2,
        ),
      })
      setIsMacrosLoading(false)
    }
  }, [macrosByIngredients])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const recipe = {
      Name: recipeName,
      Description: description,
      CookTime: cookTime,
      PrepTime: prepTime,
      TotalTime: totalTime,
      Ingredients: ingredients,
      RecipeCategory: category,
    }
    if (!isLoggedIn) {
      localStorage.setItem("userRecipe", JSON.stringify(recipe))
      toast.error("Error! You need to login first. Redirecting...")
      setTimeout(() => {
        navigate("/auth", { state: { location: "/nutrition" } })
      }, 3000)
    }
    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:5001/add-user-recipe`,
        { recipe: { ...recipe, ...macros } },
        {
          headers: {
            Authorization: `Bearer: ${localStorage.getItem("token")}`,
          },
        },
      )
      toast.success("Recipe saved succesfully. Go to your profile to view it.")
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const userRecipe = JSON.parse(localStorage.getItem("userRecipe")) || location.state?.recipe || null
    if (userRecipe) {
      setRecipeName(userRecipe.Name || "")
      setDescription(userRecipe.Description || "")
      setCookTime(userRecipe.CookTime || "")
      setPrepTime(userRecipe.PrepTime || "")
      setTotalTime(userRecipe.TotalTime || "")
      setIngredients(userRecipe.Ingredients)
      setCategory(userRecipe.RecipeCategory || "")
      setCurrentStep(location.state.step || 3)
      localStorage.removeItem("userRecipe")
    }
  }, [])

  const handleNextStep = () => {
    if (currentStep === 1 && ingredients.length === 1 && ingredients[0].name === "") {
      toast.error("You need to enter ingredients!")
      document.getElementById("quantity-0").focus()
      return
    }
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (prepTime && cookTime) {
      const prep = Number.parseInt(prepTime) || 0
      const cook = Number.parseInt(cookTime) || 0
      setTotalTime((prep + cook).toString())
    }
  }, [prepTime, cookTime])

  const handleViewModeChange = (mode) => {
    setNutritionViewMode(mode)
    if (mode === "ingredient" && macrosByIngredients && macrosByIngredients.length > 0 && selectedIngredient === null) {
      setSelectedIngredient(0)
    }
  }

  const handleIngredientSelect = (index) => {
    setSelectedIngredient(index)
  }

  const getCurrentNutritionData = () => {
    if (nutritionViewMode === "combined") {
      return macros
    } else if (nutritionViewMode === "ingredient" && macrosByIngredients && selectedIngredient !== null) {
      return macrosByIngredients[selectedIngredient]
    }
    return null
  }

  return (
    <div className="create-recipe-page">
      <div className="create-recipe-container">
        <div className="create-recipe-header">
          <h1>Know your diet</h1>
          <p>Share your culinary masterpiece with the RecipeVerse community</p>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          </div>
          <div className="progress-steps">
            <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`} onClick={() => setCurrentStep(1)}>
              <div className="step-number">1</div>
              <span>Ingredients</span>
            </div>
            <div
              className={`progress-step ${currentStep >= 2 ? "active" : ""}`}
              onClick={() => (currentStep >= 2 ? setCurrentStep(2) : null)}
            >
              <div className="step-number">2</div>
              <span>Basic Info</span>
            </div>

            <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <span>Finalize</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="create-recipe-form">
          {/* Step 2: Ingredients */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Add Your Ingredients</h2>
              <p className="step-description">
                List all ingredients needed for your recipe. Be specific with quantities and measurements.
              </p>

              <div className="ingredients-container">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-row">
                    <div className="ingredient-fields">
                      <div className="form-group quantity-field">
                        <label htmlFor={`quantity-${index}`}>Quantity and Unit</label>
                        <input
                          type="text"
                          id={`quantity-${index}`}
                          value={ingredient.quantity}
                          onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                          placeholder="E.g., 2 cups"
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="form-group ingredient-field">
                        <label htmlFor={`ingredient-${index}`}>Ingredient</label>
                        <input
                          type="text"
                          id={`ingredient-${index}`}
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                          placeholder="E.g., Paneer"
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    {ingredients.length > 1 && (
                      <button type="button" className="remove-ingredient-btn" onClick={() => removeIngredient(index)}>
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" className="add-ingredient-btn" onClick={addIngredient}>
                + Add Another Ingredient
              </button>

              <div className="nutrition-info-note">
                <div className="info-icon">ℹ️</div>
                <p>
                  After submitting your recipe, we'll automatically calculate nutrition information based on your
                  ingredients. You'll be able to review and adjust this information before publishing.
                </p>
              </div>

              <div className="form-navigation">
                <button type="button" className="next-btn" onClick={handleNextStep}>
                  Next: Enter basic info
                </button>
              </div>
            </div>
          )}
          {/* Step 1: Basic Recipe Information */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Tell us about your recipe</h2>

              <div className="form-group">
                <label htmlFor="recipe-name">Give a name for your creation</label>
                <input
                  type="text"
                  id="recipe-name"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="E.g., Paneer Tikka"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Describe your creation</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what makes this recipe special..."
                  required
                  className="form-control"
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="form-control"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="prep-time">Prep Time (minutes)</label>
                  <input
                    type="number"
                    id="prep-time"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="E.g., 15"
                    required
                    min="0"
                    className="form-control"
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="cook-time">Cook Time (minutes)</label>
                  <input
                    type="number"
                    id="cook-time"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="E.g., 30"
                    required
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="total-time">Total Time (minutes)</label>
                <input type="number" id="total-time" value={totalTime} readOnly className="form-control" />
                <small>Automatically calculated from prep and cook times</small>
              </div>

              <div className="form-navigation">
                <button type="button" className="back-btn" onClick={handlePrevStep}>
                  Back
                </button>
                <button type="button" className="next-btn" onClick={handleNextStep}>
                  Next: Finalize Recipe
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Finalize and Submit */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Finalize Your Recipe</h2>

              <div className="recipe-preview">
                <h3>Recipe Preview</h3>
                <div className="preview-content">
                  <div className="preview-left">
                    <div className="preview-header">
                      <div className="preview-details">
                        <h4>{recipeName || "Your Recipe Name"}</h4>
                        <p className="preview-description">
                          {description || "Your recipe description will appear here."}
                        </p>
                        <div className="preview-meta">
                          <span>
                            <strong>Category:</strong> {category || "Not specified"}
                          </span>
                          <span>
                            <strong>Prep:</strong> {prepTime || "0"} min
                          </span>
                          <span>
                            <strong>Cook:</strong> {cookTime || "0"} min
                          </span>
                          <span>
                            <strong>Total:</strong> {totalTime || "0"} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="preview-ingredients">
                      <h5>Ingredients:</h5>
                      <ul>
                        {ingredients.map((ing, index) => (
                          <li key={index}>
                            {ing.quantity && ing.name ? `${ing.quantity} ${ing.name}` : "Ingredient will appear here"}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {!macros && (
                      <button type="button" onClick={fetchMacros} className="publish-btn">
                        Generate macros
                      </button>
                    )}
                  </div>

                  <div className="preview-right">
                    {macros ? (
                      <div className="nutrition-view-container">
                        <div className="nutrition-view-selector">
                          <div className="nutrition-view-options">
                            <button
                              type="button"
                              className={`view-option-btn ${nutritionViewMode === "combined" ? "active" : ""}`}
                              onClick={() => handleViewModeChange("combined")}
                            >
                              Full Recipe
                            </button>
                            <button
                              type="button"
                              className={`view-option-btn ${nutritionViewMode === "ingredient" ? "active" : ""}`}
                              onClick={() => handleViewModeChange("ingredient")}
                            >
                              By Ingredient
                            </button>
                          </div>

                          {nutritionViewMode === "ingredient" && macrosByIngredients && (
                            <div className="ingredient-selector">
                              <label htmlFor="ingredient-select">Select Ingredient:</label>
                              <select
                                id="ingredient-select"
                                className="form-control"
                                value={selectedIngredient}
                                onChange={(e) => handleIngredientSelect(Number(e.target.value))}
                              >
                                {macrosByIngredients.map((item, index) => (
                                  <option key={index} value={index}>
                                    {item.Name} ({item.Serving})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="nutrition-display">
                          <NutritionInfo macros={getCurrentNutritionData()} />

                          {nutritionViewMode === "ingredient" && (
                            <div className="ingredient-info-note">
                              <p>
                                Showing nutrition for: <strong>{macrosByIngredients[selectedIngredient].Name}</strong> (
                                {macrosByIngredients[selectedIngredient].Serving})
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : isMacrosLoading ? (
                      <Loader />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="submission-options">
                <h3>What would you like to do with your recipe?</h3>
                <div className="option-buttons">
                  <button type="button" className="save-profile-btn" onClick={handleSubmit}>
                    Save to My Profile
                  </button>
                  <button type="button" className="publish-btn" onClick={() => navigate("/profile")}>
                    Go to profile
                  </button>
                </div>
                <p className="submission-note">
                  By publishing, your recipe will be shared with the RecipeVerse community and may be featured on our
                  homepage.
                </p>
              </div>

              <div className="form-navigation">
                <button type="button" className="back-btn" onClick={handlePrevStep}>
                  Back
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default UserRecipePage
