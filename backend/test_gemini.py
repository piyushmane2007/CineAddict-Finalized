from google import genai
from config import Config

client = genai.Client(api_key=Config.GEMINI_API_KEY)

def get_ai_recommendations(prompt):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text