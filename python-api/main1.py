import os
import ollama
from flask import Flask, request, jsonify
from datetime import datetime
import json
app = Flask(__name__)

def classify_recipe(ingredients):
    non_veg_keywords = ["chicken", "beef", "pork", "fish", "tuna", "shrimp", "lamb", "bacon", "broth", "gelatin", "anchovy", "duck", "oyster", "crab", "meat", "sausage", "ham"]
    dairy_keywords = ["milk", "butter", "cheese", "cream", "yogurt", "whey"]
    jain_keywords = ["onion", "garlic", "potato", "carrot", "radish", "beetroot"]
    honey_keywords = ["honey"]

    ingredients_text = " ".join(ingredients).lower()  # Convert list to a single lowercase string

    if any(word in ingredients_text for word in non_veg_keywords):
        return "Non-Vegetarian"
    elif any(word in ingredients_text for word in dairy_keywords) or any(word in ingredients_text for word in honey_keywords):
        return "Vegetarian"
    else:
        return "Vegan"
    
context = """
You are a recipe generation AI. I will give you a list of ingredients, you may add some ingredients of your choice, and give me back an appropriate recipe in this format: 
{
        "Name":"",
        "CookTime":"",
        "PrepTime":"",
        "TotalTime":"",
        "Description":"",
        "RecipeCategory":"",
        "Keywords":[],
        "Calories":float,
        "FatContent":float,
        "SaturatedFatContent":float,
        "CholesterolContent":float,
        "SodiumContent":float,
        "CarbohydrateContent":float,
        "FiberContent":float,
        "SugarContent":float,
        "ProteinContent":float,
        "RecipeServings":float,
        "RecipeInstructions":[],
        "Ingredients":[
            {
                "name":"",
                "quantity":""
            },
            {
                "name":"",
                "quantity":""
            },
        ]
    }
IMPORTANT: include all fields and return the JSON
"""

def build_prompt(ingredients):
    print("Building with ", ingredients)
    return f"{context} Generate a recipe using: {', '.join(ingredients)}"

def run_ollama(prompt):
    print("Running Ollama with Python module")
    try:
        response = ollama.chat(model="mistral", messages=[{"role": "user", "content": prompt}])
        return response["message"]["content"]
    except Exception as e:
        print(f"Error running Ollama: {e}")
        return None

@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
    print("Starting")
    data = request.get_json()
    ingredients = data.get("ingredients", [])
    print("Posted at: ", datetime.now())
    print(ingredients)
    
    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400
    try:
        prompt = build_prompt(ingredients)
        output = run_ollama(prompt)
        if output:
            recipe = json.loads(output)
            recipe['Diet'] = classify_recipe([ingredient["name"] for ingredient in recipe['Ingredients']])
            return jsonify(recipe)
        else:
            return jsonify({"error": "Failed to generate recipe"}), 500
    except NameError as e:
        print("nameerror")
    

if __name__ == '__main__':
    print(f"Starting app on port: {os.getenv('PORT', 5002)}")
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv("PORT", 5002)))
