import { Link } from "react-router-dom"
import HeroAnimation from "../components/HeroAnimation"
import "./HomePage.css"

function HomePage() {
  return (
    <div className="home-page">

      <section className="hero-section">
        <div className="hero-animation">
          <HeroAnimation />
        </div>

        <div className="container hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">RecipeVerse</span>
          </h1>
          <p className="hero-description">
            Discover delicious recipes or create your own with ingredients you already have at home.
          </p>

          <div className="hero-cards">
            <div className="hero-card">
              <div className="hero-card-content">
                <i className="hero-icon book-icon"></i>
                <h2 className="hero-card-title">Find Recipes</h2>
                <p className="hero-card-description">Browse our collection of delicious recipes</p>
                <Link to="/recipes" className="button primary">
                  Explore Recipes
                  <i className="arrow-right-icon"></i>
                </Link>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-content">
                <i className="hero-icon chef-hat-icon"></i>
                <h2 className="hero-card-title">Generate Recipe</h2>
                <p className="hero-card-description">Generate recipes with ingredients you have</p>
                <Link to="/generate" className="button primary">
                  Generate Now
                  <i className="arrow-right-icon"></i>
                </Link>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-content">
                <i className="hero-icon dish-icon"></i>
                <h2 className="hero-card-title">Know your diet</h2>
                <p className="hero-card-description">Find out nutritional info about your favourite recipes</p>
                <Link to="/nutritions" className="button primary">
                  Find out Now
                  <i className="arrow-right-icon"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">How RecipeVerse Works</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon-container">
                <i className="feature-icon book-icon"></i>
              </div>
              <h3 className="feature-title">Browse Recipes</h3>
              <p className="feature-description">Explore our extensive collection of recipes with powerful filters</p>
            </div>
            <div className="feature">
              <div className="feature-icon-container">
                <i className="feature-icon note-icon"></i>
              </div>
              <h3 className="feature-title">Fetch macros</h3>
              <p className="feature-description">Know nutrition information about your favourite recipes</p>
            </div>
            <div className="feature">
              <div className="feature-icon-container">
                <i className="feature-icon chef-hat-icon"></i>
              </div>
              <h3 className="feature-title">AI-Powered Creation</h3>
              <p className="feature-description">Generate custom recipes based on ingredients you already have</p>
            </div>
            <div className="feature">
              <div className="feature-icon-container">
                <i className="feature-icon bookmark-icon"></i>
              </div>
              <h3 className="feature-title">Save Favorites</h3>
              <p className="feature-description">Create your personal collection of favorite recipes</p>
            </div>
          </div>
        </div>
      </section>
      <div className="home-btn">
          <img src='/assets/chef_buton.png'></img>
      </div>
    </div>
  )
}

export default HomePage

