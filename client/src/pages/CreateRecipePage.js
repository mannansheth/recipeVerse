import RecipeCreator from "../components/RecipeCreator"
import "./CreateRecipePage.css"

const CreateRecipePage = () => {
  return (
    <div className="create-recipe-page">
      <div className="container">
        <h1 className="page-title">Create Your Recipe</h1>
        <p className="page-description">
          Enter the ingredients you have, and our AI will generate a delicious recipe for you.
        </p>
        {/* <div style={{
    width: "100%",
    height: "100%",
    overflow: "hidden",
    touchAction: "none",
  }}>

          <iframe
              src='/FruitNinja/index.html'
              width="100%"
              height="700px"
              style={{ border: "none" }}
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
        </div> */}
        <RecipeCreator />
      </div>
    </div>
  )
}

export default CreateRecipePage

