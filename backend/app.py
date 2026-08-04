from flask import Flask 
from config import Config 
from models.db import db
from models.user import User
from routes.user import user_bp
from routes.movies import movies_bp
from routes.auth import auth_bp
from flask_jwt_extended import JWTManager 
from models.watchlist import Watchlist 
from routes.watchlist import watchlist_bp 
from models.favorite import Favorite
from routes.favorites import favorites_bp 
from models.search_history import SearchHistory
from routes.search_history import search_history_bp
from models.recently_viewed import Recently_Viewed
from routes.recently_viewed import recently_viewed_bp
from routes.ai import ai_bp  
from flask_cors import CORS
from flask import jsonify
from models.review import Review 
from routes.review import review_bp


app = Flask(__name__) 

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}}
)

app.config.from_object(Config)



db.init_app(app)

jwt  = JWTManager(app)

app.register_blueprint(movies_bp, url_prefix="/api/movies")

app.register_blueprint(user_bp, url_prefix="/api/users") 

app.register_blueprint(auth_bp, url_prefix="/api/auth") 

app.register_blueprint(watchlist_bp, url_prefix="/api/watchlist")

app.register_blueprint(favorites_bp, url_prefix="/api/favorites")

app.register_blueprint(search_history_bp, url_prefix="/api/search-history")

app.register_blueprint(recently_viewed_bp, url_prefix="/api/recently-viewed")

app.register_blueprint( ai_bp, url_prefix="/api/ai")  

app.register_blueprint(review_bp, url_prefix="/api/reviews")

@app.route("/")
def home():
    return "CineAddict Backend is Running!"

with app.app_context():
    db.create_all()  



@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "Backend Connected"
    }), 200

if __name__ == "__main__":
    app.run(debug=True)