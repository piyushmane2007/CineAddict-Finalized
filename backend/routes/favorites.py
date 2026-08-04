from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.db import db
from models.favorite import Favorite

favorites_bp = Blueprint("favorites", __name__) 

@favorites_bp.route("/", methods=["POST"])
@jwt_required()
def add_to_favorite():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    existing_movie = Favorite.query.filter_by(
        user_id=user_id,
        movie_id=data["movie_id"]
    ).first()

    if existing_movie:
        return jsonify({
            "message": "Movie already exists in favorites"
        }), 409

    movie = Favorite(
        user_id=user_id,
        movie_id=data["movie_id"],
        movie_title=data["movie_title"],
        poster_url=data["poster_url"]
    )

    db.session.add(movie)
    db.session.commit()

    return jsonify({
        "message": "Movie added to favorites"
    }), 201  

@favorites_bp.route("/", methods=["GET"])
@jwt_required()
def get_favorites():

    user_id = int(get_jwt_identity())

    favorites = Favorite.query.filter_by(user_id=user_id).all()

    result = []

    for movie in favorites:
        result.append({
            "id": movie.id,
            "movie_id": movie.movie_id,
            "movie_title": movie.movie_title,
            "poster_url": movie.poster_url
        })

    return jsonify(result), 200   

@favorites_bp.route("/<int:movie_id>", methods=["DELETE"])
@jwt_required()
def remove_from_favorites(movie_id):

    user_id = int(get_jwt_identity())

    movie = Favorite.query.filter_by(
        user_id=user_id,
        movie_id=movie_id
    ).first()

    if not movie:
        return jsonify({"message": "Movie not found in favorites"}), 404

    db.session.delete(movie)
    db.session.commit()

    return jsonify({"message": "Movie removed from favorites"}), 200