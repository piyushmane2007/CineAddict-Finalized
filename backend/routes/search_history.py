from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.db import db
from models.search_history import SearchHistory

search_history_bp = Blueprint("search_history", __name__) 

@search_history_bp.route("/", methods=["POST"])
@jwt_required()
def save_a_search():

    user_id = int(get_jwt_identity())

    data = request.get_json()

    search = SearchHistory(
        user_id=user_id,
        search_query=data["search_query"]
    )

    db.session.add(search)
    db.session.commit()

    return jsonify({
        "message": "Search saved"
    }), 201 

@search_history_bp.route("/", methods=["GET"])
@jwt_required()
def get_search_history():

    user_id = int(get_jwt_identity())

    search = SearchHistory.query.filter_by(
        user_id=user_id
    ).order_by(
        SearchHistory.created_at.desc()
    ).all()

    result = []

    for item in search:
        result.append({
            "id": item.id,
            "search_query": item.search_query,
            "created_at": item.created_at
        })

    return jsonify(result), 200 

@search_history_bp.route("/", methods=["DELETE"])
@jwt_required()
def clear_search_history():

    user_id = int(get_jwt_identity())

    SearchHistory.query.filter_by(user_id=user_id).delete()

    db.session.commit()

    return jsonify({
        "message": "Search history cleared"
    }), 200