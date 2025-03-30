import React from "react";
import './CookbookCard.css';

const CookbookCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <h3>{recipe.Name}</h3>
      {recipe.image ? 
       <img src={recipe.image?.src.tiny} alt={recipe.Name} className="recipe-image"/>
      :null}
      
      <p><strong>Category:</strong> {recipe.RecipeCategory}</p>
      <p><strong>Time:</strong> {recipe.TotalTime} (Prep: {recipe.PrepTime}, Cook: {recipe.CookTime})</p>
      <p><strong>Calories:</strong> {recipe.Calories} kcal</p>
      <p><strong>Diet:</strong> {recipe.Diet}</p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.Ingredients.map((item, index) => (
          <li key={index}>{item.quantity} {item.name}</li>
        ))}
      </ul>
      <p><strong>Instructions:</strong></p>
      <ol>
        {recipe.RecipeInstructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default CookbookCard;
