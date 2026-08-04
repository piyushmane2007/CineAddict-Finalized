from flask import Blueprint, request, jsonify
from services.ai import get_ai_recommendations

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()

    prompt = data["prompt"]

    result = get_ai_recommendations(prompt)

    if result["success"]:
        return jsonify(result), 200

    return jsonify(result), 400