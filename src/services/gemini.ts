import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeFoodImage(base64Image: string) {
  const prompt = `Analyze this food image and return a JSON object with the following structure:
  {
    "name": "Name of the food",
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0,
    "confidence": 0.0
  }
  Ensure calories, protein, carbs, and fats are numbers. Confidence should be between 0 and 1.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
      ]
    }
  });

  const text = response.text;
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function parseFoodText(textInput: string) {
  const prompt = `Convert this food text input into nutritional data. 
  Input: "${textInput}"
  Return a JSON object:
  {
    "name": "Primary food item identified",
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });
  
  const text = response.text;
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function generateFitnessInsights(userProfile: any, recentWorkouts: any[], recentFoods: any[]) {
  const prompt = `As a senior fitness and nutrition coach, analyze the following data and provide 3 actionable insights.
  User Goal: ${userProfile.goal}
  Current Weight: ${userProfile.weight}kg
  
  Recent Workouts: ${JSON.stringify(recentWorkouts)}
  Recent Food Intake: ${JSON.stringify(recentFoods)}
  
  Return a JSON array of objects:
  [
    {
      "title": "Short catchy title",
      "message": "Detailed actionable insight",
      "type": "recovery" | "nutrition" | "consistency"
    }
  ]`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  const text = response.text;
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export async function adjustCalorieBurn(exercise: string, duration: number, intensity: string, weight: number) {
  const prompt = `Calculate the calories burned for this activity using the MET (Metabolic Equivalent of Task) formula and adjust based on intensity.
  Exercise: ${exercise}
  Duration: ${duration} minutes
  Intensity: ${intensity} (low, moderate, high)
  User Weight: ${weight}kg
  
  Return a JSON object:
  {
    "baseCalories": 0,
    "adjustedCalories": 0,
    "metValue": 0,
    "explanation": "Brief explanation"
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  const text = response.text;
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
