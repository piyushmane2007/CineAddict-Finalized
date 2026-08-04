from flask import Blueprint,request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.db import db
from models.watchlist import Watchlist 


watchlist_bp = Blueprint("watchlist", __name__ )

@watchlist_bp.route("/", methods=["POST"])
@jwt_required()
def add_to_watchlist():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    movie = Watchlist(
        user_id=user_id,
        movie_id=data["movie_id"],
        movie_title=data["movie_title"],
        poster_url=data["poster_url"]
    ) 
     
    existing_movie = Watchlist.query.filter_by(
    user_id=user_id,
    movie_id=data["movie_id"]
    ).first()

    if existing_movie:
        return jsonify({
        "message": "Movie already exists in watchlist"
        }), 409

    db.session.add(movie)
    db.session.commit()

    return jsonify({"message": "Movie added to watchlist"}), 201 

@watchlist_bp.route("/", methods=["GET"])
@jwt_required()
def get_watchlist():

    user_id = int(get_jwt_identity())

    watchlist = Watchlist.query.filter_by(user_id=user_id).all()

    result = []

    for movie in watchlist:
        result.append({
            "id": movie.id,
            "movie_id": movie.movie_id,
            "movie_title": movie.movie_title,
            "poster_url": movie.poster_url
        })

    return jsonify(result), 200  

@watchlist_bp.route("/<int:movie_id>", methods=["DELETE"])
@jwt_required()
def remove_from_watchlist(movie_id):

    user_id = int(get_jwt_identity())

    movie = Watchlist.query.filter_by(
        user_id=user_id,
        movie_id=movie_id
    ).first()

    if not movie:
        return jsonify({"message": "Movie not found in watchlist"}), 404

    db.session.delete(movie)
    db.session.commit()

    return jsonify({"message": "Movie removed from watchlist"}), 200