import os
import subprocess
from flask import Flask, request, jsonify
from datetime import datetime
app=Flask(__name__)
import shutil
print(shutil.which("ollama"))


def check_ollama():
    print("Checking Ollama status...")
    try:
        result = subprocess.run(
            ['/usr/local/bin/ollama', 'list'],  # Use just 'ollama' (since it's available in the PATH)
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8",
            # env={"OLLAMA_HOST": "127.0.0.1:11434"}
        )
        print("Ollama status: ", result.stdout)
    except Exception as e:
        print(f"Error checking Ollama status: {e}")

check_ollama()

def pull_mistral():
    print("Pulling Mistral model...")
    try:
        result = subprocess.run(
            ['/usr/local/bin/ollama', 'pull', 'mistral'],
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8",
            # env={"OLLAMA_HOST": "127.0.0.1:11434"}
        )
        print("Ollama pull result: ", result.stdout)
    except Exception as e:
        print(f"Error pulling Mistral model: {e}")

pull_mistral()
check_ollama()


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
print("context made")
def build_prompt(ingredients):
  print("Building with ", ingredients)
  prompt = f"{context} Generate a recipe using: {', '.join(ingredients)}"
  return prompt

def run_ollama(prompt):
    print("Running ollama")
    try:
        result = subprocess.run(
            ['/usr/local/bin/ollama', 'run', 'mistral', prompt],
            text=True,
            capture_output=True,
            check=True,
            encoding="utf-8",
            timeout=30,
            # env={"OLLAMA_HOST": "127.0.0.1:11434"}
        )
        print("OLLAMA: ", result.stdout)
        return result.stdout
    except subprocess.TimeoutExpired:
        print("Timeout error running Ollama")
        return None
    except subprocess.CalledProcessError as e:
        print(f"Error running Ollama: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
  
def parse_output(output):
  print("Parsing output")
  try:
    json_start = output.find('{')
    json_end = output.rfind('}') + 1
    json_str = output[json_start:json_end]
    return json_str
  except:
    return {"error": "error parsing json"}
  
@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
  print("Starting")
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
  print(f"Starting app on port: {os.getenv('PORT', 5002)}")

  app.run(debug=True, host='0.0.0.0', port=int(os.getenv("PORT", 5002)))
 