
import axios from 'axios';

const APP_ID = process.env.REACT_APP_NUTRITIONIX_APP_ID;
const API_KEY = process.env.REACT_APP_NUTRITIONIX_API_KEY;

export async function fetchNutritionInfo(ingredients) {
  const ingredientText = ingredients
    .map((item) => `${item.quantity} ${item.name}`)
    .join(' ')
    .trim();

  if (!ingredientText) {
    throw new Error("No ingredients provided");
  }

  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/nutrients',
      { query: ingredientText },
      {
        headers: {
          'x-app-id': APP_ID,
          'x-app-key': API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const allDetails = response.data;
    const macrosByIngredients = allDetails.foods.map((item) => ({
      Name: item.food_name,
      Serving: `${item.serving_qty}${item.serving_unit}`,
      Calories: item.nf_calories,
      FatContent: item.nf_total_fat,
      SaturatedFatContent: item.nf_saturated_fat,
      CholesterolContent: item.nf_cholesterol,
      SodiumContent: item.nf_sodium,
      CarbohydrateContent: item.nf_total_carbohydrate,
      FiberContent: item.nf_dietary_fiber,
      SugarContent: item.nf_sugars,
      ProteinContent: item.nf_protein,
    }));

    const round = (val) => Math.round((val + Number.EPSILON) * 100) / 100;

    const macros = {
      Calories: round(macrosByIngredients.reduce((sum, i) => sum + (i.Calories || 0), 0)),
      FatContent: round(macrosByIngredients.reduce((sum, i) => sum + (i.FatContent || 0), 0)),
      SaturatedFatContent: round(macrosByIngredients.reduce((sum, i) => sum + (i.SaturatedFatContent || 0), 0)),
      CholesterolContent: round(macrosByIngredients.reduce((sum, i) => sum + (i.CholesterolContent || 0), 0)),
      SodiumContent: round(macrosByIngredients.reduce((sum, i) => sum + (i.SodiumContent || 0), 0)),
      CarbohydrateContent: round(macrosByIngredients.reduce((sum, i) => sum + (i.CarbohydrateContent || 0), 0)),
      FiberContent: round(macrosByIngredients.reduce((sum, i) => sum + (i.FiberContent || 0), 0)),
      SugarContent: round(macrosByIngredients.reduce((sum, i) => sum + (i.SugarContent || 0), 0)),
      ProteinContent: round(macrosByIngredients.reduce((sum, i) => sum + (i.ProteinContent || 0), 0)),
    };

    return { macrosByIngredients, macros };
  } catch (error) {
    console.error("Nutrition API error:", error);
    throw error;
  }
}
