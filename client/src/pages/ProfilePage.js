import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import data from '../data/recipes.json';
import RecipeCard from '../components/RecipeCard';
import './ProfilePage.css';
import { error } from 'console';
import axios from 'axios';
import CookbookCard from '../components/CookbookCard';
import UserRecipeCard from '../components/UserRecipeCard';

const ProfilePage = ({ setIsLoggedIn }) => {
  const IP_ADDRESS = process.env.REACT_APP_IP_ADDRESS
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("wishlist");
  const [favorites, setFavorites] = useState([]);
  const [userAIRecipes, setUserAIRecipes] = useState([])
  const [userCreatedRecipes, setUserCreatedRecipes] = useState([])
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("favorites")
    toast.success("Logged out successfully");
    setIsLoggedIn(false);
    window.location.reload()
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
  };
  useEffect(() => {
    const fetchGeneratedRecipes = async () => {
      try {
        const response = await axios.get(`http://${IP_ADDRESS}:5001/get-user-ai-recipes`, {
          headers:{
            Authorization : `Bearer: ${localStorage.getItem("token")}`
          } 
        })
        const genrecipes = [];
        response.data.forEach(r => {
          const parsed_recipe = JSON.parse(r['recipe'])
          parsed_recipe['id'] = r['id'] 
          genrecipes.push(parsed_recipe)
        })
        setUserAIRecipes(genrecipes);
      } catch (err) {
        console.error("ERROR: ", err);
      }
    } 
    const fetchCreatedRecipes = async () => {
      try {
        const response = await axios.get(`http://${IP_ADDRESS}:5001/get-user-created-recipes`, {
          headers:{
            Authorization : `Bearer: ${localStorage.getItem("token")}`
          } 
        })
        const genrecipes = [];
        response.data.forEach(r => {
          const parsed_recipe = JSON.parse(r['recipe'])
          parsed_recipe['id'] = r['id'] 
          genrecipes.push(parsed_recipe)
        })
        setUserCreatedRecipes(genrecipes);
      } catch (err) {
        console.error("ERROR: ", err);
      }
    } 
    fetchGeneratedRecipes();
    fetchCreatedRecipes();
  }, [])
  useEffect(() => {
    if (localStorage.getItem("favorites") !== null) {
        const fav_ids = JSON.parse(localStorage.getItem("favorites"));
      const hashMap = {};
      data.forEach(recipe => {
        hashMap[recipe.RecipeId] = recipe;
      });
      const s = fav_ids.map(id => hashMap[id]).filter(Boolean);
      setFavorites(s);
    }
  }, []);

  const toggleFavorite = (e, RecipeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites((prev) => {
      const isFavorite = prev.some((recipe) => recipe.RecipeId === RecipeId);
  
      const newFavorites = isFavorite
        ? prev.filter((recipe) => recipe.RecipeId !== RecipeId) 
        : [...prev, data.find((recipe) => recipe.RecipeId === RecipeId)]; 
  
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Hi, {userInfo.username}</h1>

      <div className="tabs">
        <button className={activeTab === "wishlist" ? "active" : ""} onClick={() => setActiveTab("wishlist")}>
          Wishlist
        </button>
        <button className={activeTab === "cookbook" ? "active" : ""} onClick={() => setActiveTab("cookbook")}>
          Cookbook
        </button>
        <button className={activeTab === "created" ? "active" : ""} onClick={() => setActiveTab("created")}>
          My Recipes
        </button>
        <button className={activeTab === "update" ? "active" : ""} onClick={() => setActiveTab("update")}>
          Update Profile
        </button>
      </div>

      <div className="content">
        {activeTab === "wishlist" && (
          <div className="wishlist-container">
            <h2>Your Wishlist</h2>
            <div className="wishlist-grid">
              {favorites.length > 0 ? (
                favorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.RecipeId}
                    recipe={recipe}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                  />
                ))
              ) : (
                <h4>No recipes added to wishlist</h4>
              )}
            </div>
          </div>
        )}

        {activeTab === "cookbook" && (
          <div>
            <h2>My Cookbook</h2>
            <div className="cookbook-grid">
              {userAIRecipes.map((recipe) => (
                <CookbookCard key={recipe.id} recipe={recipe} setUserRecipes={setUserAIRecipes} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "created" && (
          <div>
            <h2>My Created Recipes</h2>
            <div className="created-recipes-grid">
              {userCreatedRecipes.length > 0 ? (
                userCreatedRecipes.map((recipe) => (
                  <UserRecipeCard key={recipe.id} recipe={recipe} setUserRecipes={setUserCreatedRecipes} />
                ))
              ) : (
                <h4>You haven't created any recipes yet</h4>
              )}
            </div>
          </div>
        )}

        {activeTab === "update" && (
          <>
            <div className="update-form">
              <h2 className="form-heading">Update Profile</h2>

              <label className="form-label">Username:</label>
              <input className="form-input" type="text" placeholder="Enter username" />

              <label className="form-label">Email:</label>
              <input className="form-input" type="email" placeholder="Enter email" />
            </div>

            <button className="form-button">Save Changes</button>
          </>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default ProfilePage;
