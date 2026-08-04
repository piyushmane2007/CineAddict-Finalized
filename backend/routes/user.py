from flask import Blueprint, request, jsonify 
from services.users_service import create_user, get_all_users,get_user_by_id,update_user,delete_user

user_bp  = Blueprint("users",__name__)

@user_bp.route("/",methods=["POST"])
def register_user():
    data = request.get_json() 

    user = create_user(
        username = data["username"], 
        email = data["email"],
        password = data["password"]
    ) 

    return jsonify({
        "messge": "User created successfully",
        "username" : user.username
    }) , 201 ## HTTP status code.

@user_bp.route("/",methods=["GET"])
def get_users():
    users = get_all_users()

    result = []

    for user in users:
        result.append({
            "id":user.id,
            "username":user.username,
            "email":user.email
        }) 

    return jsonify(result),200 

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = get_user_by_id(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200

@user_bp.route("/<int:user_id>", methods=["PUT"])
def edit_user(user_id):
    data = request.get_json()

    user = update_user(
        user_id=user_id,
        username=data["username"],
        email=data["email"]
    )

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "message": "User updated successfully",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }), 200

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def remove_user(user_id):
    deleted = delete_user(user_id)

    if not deleted:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "message": "User deleted successfully"
    }), 200

