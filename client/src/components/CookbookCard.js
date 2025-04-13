import React, { useState } from "react";
import "./CookbookCard.css";
import { FaCircleDot, FaCommentDots, FaEllipsis, FaHandDots, FaRegCommentDots } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

function CookbookCard({ recipe, setUserRecipes }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate()
  
  const IP_ADDRESS = process.env.REACT_APP_IP_ADDRESS
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };
  
  // Format time strings
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };
  
  const getImageUrl = () => {
    if (recipe.image && recipe.image.src) {
      return recipe.image.src.medium || recipe.image.src.small || recipe.image.url;
    }
    return null;
  };
  const deleteRecipe = async (id) => {
    try {
      const response = await axios.delete(`http://${IP_ADDRESS}:5001/delete-user-AI-recipe`, {
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
  const handleViewRecipe = () => {
    navigate('/recipes/generated', { state: {generatedRecipe: recipe}})
  }
  return (
    <div className="cookbook-card">
      <div className="cookbook-card-image-container">
        <img 
          src={getImageUrl() || "/assets/placeholder.jpg"}
          alt={recipe.Name}
          className="cookbook-card-image"
        />
        <div className="cookbook-card-badges">
          {recipe.Diet && (
            <span className="cookbook-card-diet-badge">
              {recipe.Diet}
            </span>
          )}
        </div>
        <div className="cookbook-card-actions">
          <div className="dropdown-container">
            <button 
              className="cookbook-card-action-button"
              onClick={toggleDropdown}
            >
              <FaEllipsis></FaEllipsis>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item">Share Recipe</button>
                <button className="dropdown-item" onClick={() => window.print()}>Print Recipe</button>
                <button className="dropdown-item delete" onClick={() => deleteRecipe(recipe.id)}>Delete Recipe</button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="cookbook-card-header">
        <div className="cookbook-card-title-container">
          <h3 className="cookbook-card-title">{recipe.Name}</h3>
          <div className="cookbook-card-meta">
            <div className="cookbook-card-time">
              <i className="icon-clock"></i>
              <span>{formatTime(recipe.TotalTime)}</span>
            </div>
            {recipe.RecipeCategory && (
              <span className="cookbook-card-category">
                {recipe.RecipeCategory}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="cookbook-card-content">
        <p className="cookbook-card-description">{recipe.Description}</p>
        
        {recipe.Keywords && recipe.Keywords.length > 0 && (
          <div className="cookbook-card-keywords">
            {recipe.Keywords.slice(0, 3).map((keyword, index) => (
              <span key={index} className="cookbook-card-keyword">
                {keyword}
              </span>
            ))}
            {recipe.Keywords.length > 3 && (
              <span className="cookbook-card-keyword more">
                +{recipe.Keywords.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="cookbook-card-footer">
        <button className="cookbook-card-view-button" onClick={handleViewRecipe}>
          <i className="icon-chef-hat"></i>
          View Recipe
        </button>
      </div>
    </div>
  );
}

export default CookbookCard;
