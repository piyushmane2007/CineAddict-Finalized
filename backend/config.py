import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()



# class Config:
#     # Set tokens to expire in 30 days (or False to disable expiration for dev)
#     JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "cineaddict_super_secret_key_123" 

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 