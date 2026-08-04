# Fetches trending movies from TMDb.
import requests 
from dotenv import load_dotenv
import os
from config import Config


BASE_URL = "https://api.themoviedb.org/3"
load_dotenv()

def get_trending_movies():
    
    api_key = os.getenv("TMDB_API_KEY")
    params = {
        "api_key":api_key 
        
    } 

    url= BASE_URL + "/trending/movie/day"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data
def search_movies(query):

    api_key = os.getenv("TMDB_API_KEY")

    params = {
        "api_key": api_key,
        "query": query
    }

    url = f"{BASE_URL}/search/movie"

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    movies = []

    for movie in data.get("results", []):

        movies.append({
            "id": movie["id"],
            "title": movie["title"],
            "overview": movie["overview"],
            "poster_path": movie["poster_path"],
            "backdrop_path": movie["backdrop_path"],
            "vote_average": movie["vote_average"],
            "release_date": movie["release_date"]
        })

    return movies
    
def get_movie_details(movie_id):
    api_key =  os.getenv("TMDB_API_KEY") 
    params = {
        "api_key" : api_key , 
        
    } 

    url = f"{BASE_URL}/movie/{movie_id}"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data

def get_movie_trailer(movie_id):
    api_key = os.getenv("TMDB_API_KEY")

    params = {
        "api_key": api_key
    }

    url = f"{BASE_URL}/movie/{movie_id}/videos"

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    for video in data["results"]:
        if (
            video["site"] == "YouTube"
            and video["type"] == "Trailer"
            and video["official"]
        ):
            return {
                "youtube_key": video["key"],
                "trailer_url": f"https://www.youtube.com/embed/{video['key']}",
                "youtube_url": f"https://www.youtube.com/watch?v={video['key']}"
            }

    return None

def get_movie_credits(movie_id):
    api_key = os.getenv("TMDB_API_KEY")

    params = {
        "api_key": api_key
    }

    url = f"{BASE_URL}/movie/{movie_id}/credits"

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    # Get Director
    director = None

    for person in data["crew"]:
        if person["job"] == "Director":
            director = person["name"]
            break

    # Get Cast
    cast = []

    for actor in data["cast"][:20]:
        cast.append({
            "id": actor["id"],
            "name": actor["name"],
            "character": actor["character"],
            "profile_path": (
                f"https://image.tmdb.org/t/p/w500{actor['profile_path']}"
                if actor["profile_path"]
                else None
            )
        })

    return {
        "director": director,
        "cast": cast
    }

def get_movie_recommendations(movie_id):
    api_key =  os.getenv("TMDB_API_KEY") 
    params = {
        "api_key" : api_key , 
        
    }  
    url = f"{BASE_URL}/movie/{movie_id}/recommendations"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    movies = []

    for recommended_movie in data["results"][:5]:
        movies.append({
        "id": recommended_movie["id"],
        "title": recommended_movie["title"],
        "poster_path": recommended_movie["poster_path"],
        "vote_average": recommended_movie["vote_average"]
    })

    return movies 

def get_popular_movies():
    api_key =  os.getenv("TMDB_API_KEY") 
    params = {
        "api_key" : api_key , 
        
    } 
    url = f"{BASE_URL}/movie/popular" 
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data
    

def get_top_rated_movies():
    api_key =  os.getenv("TMDB_API_KEY")
    params = {
        "api_key" : api_key , 
        
    } 
    url = f"{BASE_URL}/movie/top_rated"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data

def get_upcoming_movies():
    api_key =  os.getenv("TMDB_API_KEY")
    params = {
        "api_key" : api_key , 
        
    } 
    url = f"{BASE_URL}/movie/upcoming"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data

def get_now_playing_movies():

    api_key =  os.getenv("TMDB_API_KEY")
    params = {
        "api_key" : api_key , 
        
    } 
    url = f"{BASE_URL}/movie/now_playing"   
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data


def get_similar_movies(movie_id):
    api_key =  os.getenv("TMDB_API_KEY") 
    params = {
        "api_key" : api_key , 
        
    }  
    url = f"{BASE_URL}/movie/{movie_id}/similar"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    movies = []

    for similar_movie in data["results"][:5]:
        movies.append({
        "id":similar_movie["id"],
        "title":similar_movie["title"],
        "poster_path":similar_movie["poster_path"],
        "vote_average":similar_movie["vote_average"]
    })

    return movies   


def get_movie_reviews(movie_id):
    api_key =  os.getenv("TMDB_API_KEY") 
    params = {
        "api_key" : api_key , 
        
    }  
    url = f"{BASE_URL}/movie/{movie_id}/reviews"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    reviews = []
    for review_content in data["results"][:5]:
        reviews.append({
            "author":review_content["author"],
            "rating": review_content["author_details"].get("rating"),
            "content":review_content["content"]

        })
    return reviews   

def get_movie_genres():

    api_key =  os.getenv("TMDB_API_KEY")
    params = {
        "api_key" : api_key , 
        
    } 
    url = f"{BASE_URL}/genre/movie/list"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    return data["genres"] 


def get_discover_movies(genre):

    api_key =  os.getenv("TMDB_API_KEY")
    params = {
        "api_key" : api_key , 
        "with_genres": genre
        
    } 
    url = f"{BASE_URL}/discover/movie"
    response = requests.get(url,params=params) 
    response.raise_for_status()
    data = response.json() 
    discover = []
    for discover_content in data["results"][:5]:
        discover.append({
            "id":discover_content["id"],
        "title":discover_content["title"],
        "poster_path":discover_content["poster_path"],
        "vote_average":discover_content["vote_average"]

        })
    return discover 









    
