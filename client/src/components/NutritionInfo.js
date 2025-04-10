import React from 'react'
import './NutritionInfo.css'
const NutritionInfo = ({macros}) => {
  return (
    <div className="preview-nutrition">
      <div className="nutrition-label">
        <div className="nutrition-header">
          <h6>Nutrition Facts</h6>
        </div>
        <div className="serving-info">
          <p>Serving Size 1 serving</p>
        </div>

        <div className="calories-line">
          <span className="nutrient-name">Calories</span>
          <span className="nutrient-value">{macros.Calories}</span>
        </div>

        <div className="daily-value-header">
          <p>% Daily Value*</p>
        </div>

        <div className="nutrient-line">
          <div className="nutrient-main">
            <span className="nutrient-name">
              <strong>Total Fat</strong> {macros.FatContent}g
            </span>
            <span className="nutrient-percent">{Math.round((macros.FatContent / 78) * 100)}%</span>
          </div>
          <div className="nutrient-sub">
            <span className="nutrient-name">Saturated Fat {macros.SaturatedFatContent}g</span>
            <span className="nutrient-percent">
              {Math.round((macros.SaturatedFatContent / 20) * 100)}%
            </span>
          </div>
        </div>

        <div className="nutrient-line">
          <span className="nutrient-name">
            <strong>Cholesterol</strong> {macros.CholesterolContent}mg
          </span>
          <span className="nutrient-percent">
            {Math.round((macros.CholesterolContent / 300) * 100)}%
          </span>
        </div>

        <div className="nutrient-line">
          <span className="nutrient-name">
            <strong>Sodium</strong> {macros.SodiumContent}mg
          </span>
          <span className="nutrient-percent">
            {Math.round((macros.SodiumContent / 2300) * 100)}%
          </span>
        </div>

        <div className="nutrient-line">
          <div className="nutrient-main">
            <span className="nutrient-name">
              <strong>Total Carbohydrate</strong> {macros.CarbohydrateContent}g
            </span>
            <span className="nutrient-percent">
              {Math.round((macros.CarbohydrateContent / 275) * 100)}%
            </span>
          </div>
          <div className="nutrient-sub">
            <span className="nutrient-name">Dietary Fiber {macros.FiberContent}g</span>
            <span className="nutrient-percent">
              {Math.round((macros.FiberContent / 28) * 100)}%
            </span>
          </div>
          <div className="nutrient-sub">
            <span className="nutrient-name">Total Sugars {macros.SugarContent}g</span>
            <span className="nutrient-percent"></span>
          </div>
        </div>

        <div className="nutrient-line">
          <span className="nutrient-name">
            <strong>Protein</strong> {macros.ProteinContent}g
          </span>
          <span className="nutrient-percent"></span>
        </div>

        <div className="nutrition-footer">
          <p>
            * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a
            daily diet. 2,000 calories a day is used for general nutrition advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NutritionInfo
