from flask import Blueprint,jsonify,request
from services.tmbd import get_trending_movies,search_movies,get_movie_details,get_movie_trailer,get_movie_credits,get_movie_recommendations,get_popular_movies,get_top_rated_movies,get_upcoming_movies,get_now_playing_movies,get_similar_movies,get_movie_reviews,get_discover_movies,get_movie_genres


movies_bp = Blueprint("movies",__name__)

@movies_bp.route("/trending",methods=["GET"])
def trending_movies():
    movies = get_trending_movies()
    return jsonify(movies)

@movies_bp.route("/search", methods=["GET"])
def search_movies_route():

    query = request.args.get("query")

    # Frontend fallback support
    if not query:
        query = request.args.get("q")

    if not query:
        return jsonify({
            "error": "Query parameter is required"
        }), 400

    results = search_movies(query)

    return jsonify(results), 200

@movies_bp.route("/<int:movie_id>")
def movie_details(movie_id):
    details =  get_movie_details(movie_id) 
    return jsonify(details) 

@movies_bp.route("/<int:movie_id>/trailer")
def movie_trailer(movie_id):

    trailer = get_movie_trailer(movie_id)

    if trailer is None:
        return jsonify({
            "success": False,
            "message": "Trailer not found."
        }), 404

    return jsonify({
        "success": True,
        "data": trailer
    })
@movies_bp.route("/<int:movie_id>/credits")
def movie_credits(movie_id):
    credits =  get_movie_credits(movie_id) 
    return jsonify(credits) 

@movies_bp.route("/<int:movie_id>/recommendations")
def movie_recommendations(movie_id):
    recommendations =  get_movie_recommendations(movie_id) 
    return jsonify(recommendations) 

@movies_bp.route("/popular",methods=["GET"])
def popular_movies():
    popular = get_popular_movies()
    return jsonify(popular) 

@movies_bp.route("/top_rated",methods=["GET"])
def top_rated_movies():
    top_rated = get_top_rated_movies()
    return jsonify(top_rated)

@movies_bp.route("/upcoming",methods=["GET"])
def upcoming_movies():
    upcoming = get_upcoming_movies()
    return jsonify(upcoming) 

@movies_bp.route("/now_playing",methods=["GET"])
def now_playing_movies():
    now_playing = get_now_playing_movies()
    return jsonify(now_playing) 

@movies_bp.route("/<int:movie_id>/similar")
def similar_movies(movie_id):
    similar =  get_similar_movies(movie_id) 
    return jsonify(similar) 


@movies_bp.route("/<int:movie_id>/reviews")
def movie_review(movie_id):
    review =  get_movie_reviews(movie_id) 
    return jsonify(review)

@movies_bp.route("/genres",methods=["GET"])
def movie_genres():
    genres =  get_movie_genres()
    return jsonify(genres) 

@movies_bp.route("/discover", methods=["GET"])
def discover_movies():
    genre = request.args.get("genre")

    if not genre:
        return jsonify({"error": "Genre parameter is required"}), 400

    results = get_discover_movies(genre)
    return jsonify(results)