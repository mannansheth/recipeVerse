"use client"

import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import "./RecipeFilters.css"

function RecipeFilters() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialQuery = searchParams.get("query") || ""
  const initialCuisines = searchParams.getAll("cuisine")
  const initialDiets = searchParams.getAll("diet")
  const initialMinTime = Number.parseInt(searchParams.get("minTime") || "0")
  const initialMaxTime = Number.parseInt(searchParams.get("maxTime") || "1000")
  
  const [query, setQuery] = useState(initialQuery)
  const [selectedCuisines, setSelectedCuisines] = useState(initialCuisines)
  const [selectedDiets, setSelectedDiets] = useState(initialDiets)
  const [timeRange, setTimeRange] = useState([initialMinTime, initialMaxTime])
  const [expandedSections, setExpandedSections] = useState({
    cuisines: true,
    diets: true,
    time: true,
  })

  const cuisines = [
    "Dessert",
    "High Protein",
    "Low Carb",
    "Beverages",
    "Breakfast",
    "Lunch",
    "Chicken",
    "Easy"
  ]

  const diets = [
    "Vegetarian",
    "Vegan",
    "Non-Vegetarian",
  ]

  const toggleCuisine = (cuisine) => {
    setSelectedCuisines((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]))
  }

  const toggleDiet = (diet) => {
    setSelectedDiets((prev) => (prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]))
  }
  const handleTimeChange = (e, index) => {
    const newValue = Number.parseInt(e.target.value)
    setTimeRange((prev) => {
      const newRange = [...prev]
      newRange[index] = newValue
      return newRange
    })
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (query) params.set("query", query)

    selectedCuisines.forEach((cuisine) => {
      params.append("cuisine", cuisine)
    })

    selectedDiets.forEach((diet) => {
      params.append("diet", diet)
    })

    params.set("minTime", timeRange[0].toString())
    params.set("maxTime", timeRange[1].toString())

    navigate(`/recipes?${params.toString()}`)
  }

  // Reset filters
  const resetFilters = () => {
    setQuery("")
    setSelectedCuisines([])
    setSelectedDiets([])
    setTimeRange([0, 2000])
    navigate("/recipes")
  }

  return (
    <div className="recipe-filters">
      <div className="filter-header">
        <h2 className="filter-title">Filters</h2>
        <button className="filter-reset-button" onClick={resetFilters}>
          Reset
        </button>
      </div>
      <button onClick={applyFilters} className="button primary apply-filters-button">
        Apply Filters
      </button>
      <div className="filter-section">
        <div className="search-input-container">
          <input
            id="search"
            type="search"
            placeholder="Search recipes..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection("time")}>
          <h3 className="filter-section-title">Cooking Time (minutes)</h3>
          <span className="filter-section-toggle">{expandedSections.time ? "−" : "+"}</span>
        </div>
      </div>
      {expandedSections.time && (
          <div className="time-range-container">
            <div className="time-inputs">
              <div className="time-input-group">
                <label htmlFor="min-time" className="time-label">
                  Min
                </label>
                <input
                  id="min-time"
                  type="number"
                  min="0"
                  max={timeRange[1]}
                  value={timeRange[0]}
                  onChange={(e) => handleTimeChange(e, 0)}
                  className="time-input"
                />
              </div>
              <div className="time-input-group">
                <label htmlFor="max-time" className="time-label">
                  Max
                </label>
                <input
                  id="max-time"
                  type="number"
                  min={timeRange[0]}
                  max="180"
                  value={timeRange[1]}
                  onChange={(e) => handleTimeChange(e, 1)}
                  className="time-input"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              value={timeRange[1]}
              onChange={(e) => handleTimeChange(e, 1)}
              className="time-range"
            />
          </div>
        )}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection("cuisines")}>
          <h3 className="filter-section-title">Categories</h3>
          <span className="filter-section-toggle">{expandedSections.cuisines ? "−" : "+"}</span>
        </div>
        {expandedSections.cuisines && (
          <div className="filter-options">
            {cuisines.map((cuisine) => (
              <div key={cuisine} className="filter-option">
                <input
                  type="checkbox"
                  id={`cuisine-${cuisine}`}
                  checked={selectedCuisines.includes(cuisine)}
                  onChange={() => toggleCuisine(cuisine)}
                  className="filter-checkbox"
                />
                <label htmlFor={`cuisine-${cuisine}`} className="filter-option-label">
                  {cuisine}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleSection("diets")}>
          <h3 className="filter-section-title">Dietary Restrictions</h3>
          <span className="filter-section-toggle">{expandedSections.diets ? "−" : "+"}</span>
        </div>
        {expandedSections.diets && (
          <div className="filter-options">
            {diets.map((diet) => (
              <div key={diet} className="filter-option">
                <input
                  type="checkbox"
                  id={`diet-${diet}`}
                  checked={selectedDiets.includes(diet)}
                  onChange={() => toggleDiet(diet)}
                  className="filter-checkbox"
                />
                <label htmlFor={`diet-${diet}`} className="filter-option-label">
                  {diet}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeFilters

