import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserRecipeCard.css";
import NutritionInfo from "./NutritionInfo";
import { FaEllipsis } from "react-icons/fa6";
import { toast } from "react-toastify";

const UserRecipeCard = ({ recipe, setUserRecipes }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const IP_ADDRESS = process.env.REACT_APP_IP_ADDRESS;


  const handleDelete = async (id) => {
      try {
        const response = await axios.delete(`http://${IP_ADDRESS}:5001/delete-user-created-recipe`, {
          headers: {
            Authorization: `Bearer: ${localStorage.getItem("token")}`
          }, 
          data: {id}
        })
        setUserRecipes(prev => prev.filter((r) => r.id !== id))
        toast.success("Recipe removed")
      } catch (err) {
        console.error("error: ", err);
      }
    } 

  const handleEdit = () => {
    navigate(`/nutritions`, {state: {recipe, step:1}});
  };

  const handleViewDetails = () => {
    navigate(`/nutritions`, {state: {recipe, step:3}});
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="user-recipe-card">
      <div className="user-recipe-header">
        <h3 className="user-recipe-title">{recipe.Name || recipe.title}</h3>
        <div className="user-recipe-actions">
          <button className="action-button" onClick={toggleDropdown}>
            <FaEllipsis />
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleViewDetails}>View Details</button>
              <button onClick={handleEdit}>Edit Recipe</button>
              <button onClick={() => handleDelete(recipe.id)} className="delete-button">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="user-recipe-description">{recipe.Description || recipe.description || "A delicious homemade recipe."}</p>
      <div className="nutrition-label-div" >

        <NutritionInfo macros={recipe}/>
      </div>

      

      <div className="recipe-meta">
        {recipe.CookTime && (
          <span className="meta-item">
            <i className="meta-icon">⏱️</i> Cook: {recipe.CookTime.replace("PT", "").replace("M", "")} min
          </span>
        )}
        {recipe.PrepTime && (
          <span className="meta-item">
            <i className="meta-icon">⏱️</i> Prep: {recipe.PrepTime.replace("PT", "").replace("M", "")} min
          </span>
        )}
        {recipe.RecipeCategory && <span className="meta-item category">{recipe.RecipeCategory}</span>}
      </div>

      <div className="user-recipe-footer">
        <button className="view-button" onClick={handleViewDetails}>
          View Recipe
        </button>
      </div>
    </div>
  )
}

export default UserRecipeCard;
