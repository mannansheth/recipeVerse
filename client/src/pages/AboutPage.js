import React from "react"
import "./AboutPage.css"
import { Link } from "react-router-dom"
import { FaUtensils, FaCalculator, FaHeart, FaUsers, FaLaptopCode, FaEnvelope } from "react-icons/fa"
import { MdFoodBank, MdOutlineHealthAndSafety } from "react-icons/md"
import { IoMdNutrition } from "react-icons/io"

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About RecipeVerse</h1>
          <p>Discover, create, and share culinary masterpieces with precise nutrition insights</p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At RecipeVerse, we believe that cooking should be accessible, enjoyable, and healthy for everyone. Our
            mission is to empower home cooks with the tools they need to create delicious meals while understanding
            exactly what goes into their food.
          </p>
          <p>
            Whether you're a seasoned chef or just starting your culinary journey, RecipeVerse provides a platform to
            discover new recipes, share your creations, and make informed decisions about your nutrition.
          </p>
        </section>

        <section className="about-section features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <MdFoodBank />
              </div>
              <h3>Recipe Discovery</h3>
              <p>Browse thousands of recipes across various cuisines and dietary preferences.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUtensils />
              </div>
              <h3>Recipe Creation</h3>
              <p>Create and share your own recipes with our easy-to-use recipe builder.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <IoMdNutrition />
              </div>
              <h3>Nutrition Analysis</h3>
              <p>Get detailed nutrition information for entire recipes or individual ingredients.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaHeart />
              </div>
              <h3>Personal Cookbook</h3>
              <p>Save your favorite recipes and creations in your personal cookbook.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <MdOutlineHealthAndSafety />
              </div>
              <h3>Dietary Awareness</h3>
              <p>Filter recipes based on dietary restrictions and nutritional goals.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaCalculator />
              </div>
              <h3>Ingredient-Level Insights</h3>
              <p>Understand the nutritional contribution of each ingredient in your recipes.</p>
            </div>
          </div>
        </section>

        <section className="about-section how-it-works">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number-abt">1</div>
              <div className="step-content">
                <h3>Create an Account</h3>
                <p>Sign up for a free account to access all features of RecipeVerse.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number-abt">2</div>
              <div className="step-content">
                <h3>Discover or Create</h3>
                <p>Browse our recipe collection or create your own recipes with our intuitive recipe builder.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number-abt">3</div>
              <div className="step-content">
                <h3>Analyze Nutrition</h3>
                <p>
                  Get detailed nutrition information for your recipes, with the ability to see nutrition data for
                  individual ingredients.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number-abt">4</div>
              <div className="step-content">
                <h3>Save and Share</h3>
                <p>Save recipes to your cookbook and share your creations with the RecipeVerse community.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-avatar">
                <FaUsers />
              </div>
              <h3>Culinary Experts</h3>
              <p>Professional chefs who curate and verify recipes for quality and taste.</p>
            </div>

            <div className="team-member">
              <div className="team-member-avatar">
                <MdOutlineHealthAndSafety />
              </div>
              <h3>Nutrition Specialists</h3>
              <p>Registered dietitians ensuring accurate nutrition information.</p>
            </div>

            <div className="team-member">
              <div className="team-member-avatar">
                <FaLaptopCode />
              </div>
              <h3>Tech Innovators</h3>
              <p>Developers and designers creating a seamless cooking experience.</p>
            </div>
          </div>
        </section>

        <section className="about-section contact-section">
          <h2>Get in Touch</h2>
          <p>
            Have questions, suggestions, or feedback? We'd love to hear from you! Reach out to our team at{" "}
            <a href="mailto:contact@recipeverse.com">contact@recipeverse.com</a>.
          </p>
          <div className="contact-button-container">
            <Link to="/contact" className="contact-button-abt">
              <FaEnvelope className="contact-icon" />
              Contact Us
            </Link>
          </div>
        </section>
      </div>

      <div className="about-cta">
        <div className="about-cta-content">
          <h2>Ready to start your culinary journey?</h2>
          <p>Join RecipeVerse today and transform the way you cook!</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">
              Sign Up Now
            </Link>
            <Link to="/recipes" className="cta-button secondary">
              Explore Recipes
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
