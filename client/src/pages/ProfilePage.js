import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { toast } from 'react-toastify';
import data from '../data/mock1.json';
import RecipeCard from '../components/RecipeCard';
import './ProfilePage.css';
import { error } from 'console';
import axios from 'axios';
import CookbookCard from '../components/CookbookCard';

const ProfilePage = ({ setIsLoggedIn }) => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("wishlist");
  const [favorites, setFavorites] = useState([]);
  const [userRecipes, setUserRecipes] = useState([])
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setIsLoggedIn(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://192.168.1.100:5001/get-recipe', {
          headers:{
            Authorization : `Bearer: ${localStorage.getItem("token")}`
          } 
        })
        const genrecipes = [];
        response.data.forEach(r => {
          genrecipes.push(JSON.parse(r['recipe']))
        })
        setUserRecipes(genrecipes);
      } catch (err) {
        console.error("ERROR: ", err);
      }
    } 
    fetchRecipes();
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
      <h1 className="profile-title">My Profile</h1>
      
      <div className="tabs">
        <button className={activeTab === "wishlist" ? "active" : ""} onClick={() => setActiveTab("wishlist")}>
          Wishlist
        </button>
        <button className={activeTab === "cookbook" ? "active" : ""} onClick={() => setActiveTab("cookbook")}>
          Cookbook
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
            {favorites.length > 0 ?
              favorites.map(recipe => (
              <RecipeCard
                key={recipe.RecipeId}
                recipe={recipe}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))
          : <h4>No recipes added to wishlist</h4>
          }
          </div>

            
          </div>
        )}
        
        {activeTab === "cookbook" && (
          <div>
            <h2>My Cookbook</h2>
            <div className="cookbook-grid">
            {userRecipes.map((recipe, i) => (
              <CookbookCard 
              key={i}
              recipe = {recipe}
              />
            ))}
            </div>
          </div>
        )}
        
        {activeTab === "update" && (
          <>
          <div className="update-form">
            <h2>Update Profile</h2>
            <label>Name:</label>
            <input type="text" placeholder="Enter name" />
            <label>Email:</label>
            <input type="email" placeholder="Enter email" />
            
          </div>
          <button>Save Changes</button>
          </>
        )}
      </div>
      
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
