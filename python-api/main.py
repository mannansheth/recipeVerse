import json
import subprocess
from flask import Flask, request, jsonify
from datetime import datetime
app=Flask(__name__)
context = r"""
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
        ],
        "Diet":"Vegan/Vegetarian/Non-Vegetarian"
    },
IMPORTANT: include all fields and return the JSON  """

def build_prompt(ingredients):
  prompt = f"{context} Generate a recipe using: {', '.join(ingredients)}"
  return prompt

def run_ollama(prompt):
  try:
    result = subprocess.run(
      ['ollama', 'run', 'mistral', prompt],
      text= True,
      capture_output=True,
      check=True,
      encoding="utf-8"
    ) 
    return result.stdout
  except:
    print("Error running ollama")
    return None
  
def parse_output(output):
  try:
    json_start = output.find('{')
    json_end = output.rfind('}') + 1
    json_str = output[json_start:json_end]
    return json_str
  except:
    return {"error": "error parsing json"}
  
@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
  data = request.get_json()
  ingredients = data.get("ingredients", [])
  print("Posted at: ", datetime.now())
  print(ingredients)
  if not ingredients:
    return jsonify({"error": "No ingredients provided"}), 400
  prompt = build_prompt(ingredients)
  output = run_ollama(prompt)

  if output:
      recipe = parse_output(output)
      return jsonify(recipe)
  else:
      return jsonify({"error": "Failed to generate recipe"}), 500
  
if __name__=='__main__':
  app.run(debug=True, port=5002)
 