from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime 
from models.db import db
from models.recently_viewed import Recently_Viewed 

recently_viewed_bp = Blueprint("recently_viewed", __name__) 

@recently_viewed_bp.route("/", methods=["POST"])
@jwt_required()
def add_recently_viewed():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    movie = Recently_Viewed.query.filter_by(
        user_id=user_id,
        movie_id=data["movie_id"]
    ).first()

    if movie:
        movie.viewed_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            "message": "Recently viewed updated"
        }), 200

    movie = Recently_Viewed(
        user_id=user_id,
        movie_id=data["movie_id"],
        movie_title=data["movie_title"],
        poster_url=data["poster_url"]
    )

    db.session.add(movie)
    db.session.commit()

    return jsonify({
        "message": "Movie added to recently viewed"
    }), 201  

@recently_viewed_bp.route("/", methods=["GET"])
@jwt_required()
def get_recently_viewed():

    user_id = int(get_jwt_identity())

    movies = Recently_Viewed.query.filter_by(
        user_id=user_id
    ).order_by(
        Recently_Viewed.viewed_at.desc()
    ).all()

    result = []

    for movie in movies:
        result.append({
            "id": movie.id,
            "movie_id": movie.movie_id,
            "movie_title": movie.movie_title,
            "poster_url": movie.poster_url,
            "viewed_at": movie.viewed_at
        })

    return jsonify(result), 200 

@recently_viewed_bp.route("/<int:movie_id>", methods=["DELETE"])
@jwt_required()
def remove_recently_viewed(movie_id):

    user_id = int(get_jwt_identity())

    movie = Recently_Viewed.query.filter_by(
        user_id=user_id,
        movie_id=movie_id
    ).first()

    if not movie:
        return jsonify({
            "message": "Movie not found in recently viewed"
        }), 404

    db.session.delete(movie)
    db.session.commit()

    return jsonify({
        "message": "Movie removed from recently viewed"
    }), 200
