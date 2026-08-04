import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("TMDB_API_KEY")

url = "https://api.themoviedb.org/3/movie/27205/videos"

response = requests.get(
    url,
    params={"api_key": api_key},
    timeout=10
)

print(response.status_code)
print(response.text)