from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.db import db
from models.review import Review

review_bp = Blueprint("review", __name__) 

@review_bp.route("/", methods=["POST"])
@jwt_required()
def create_review():

    current_user = int(get_jwt_identity())

    data = request.get_json()

    movie_id = data.get("movie_id")
    rating = data.get("rating")
    review_text = data.get("review")

    if not movie_id or not rating or not review_text:
        return jsonify({
            "error": "All fields are required"
        }), 400

    existing_review = Review.query.filter_by(
        user_id=current_user,
        movie_id=movie_id
    ).first()

    if existing_review:
        return jsonify({
            "error": "You have already reviewed this movie."
        }), 400

    new_review = Review(
        user_id=current_user,
        movie_id=movie_id,
        rating=rating,
        review=review_text
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        "message": "Review submitted successfully"
    }), 201  

@review_bp.route("/<int:movie_id>", methods=["GET"])
def get_reviews(movie_id):

    reviews = Review.query.filter_by(movie_id=movie_id).order_by(Review.created_at.desc()).all()

    response = []

    for review in reviews:
        response.append({
            "id": review.id,
            "username": review.user.username,
            "rating": review.rating,
            "review": review.review,
            "created_at": review.created_at.isoformat()
        })

    return jsonify(response), 200