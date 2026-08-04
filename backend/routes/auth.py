from flask import Blueprint, request, jsonify

from services.auth_service import register_user, login_user

from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__) 

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    user = register_user(
        username= data["username"],
        email=data["email"],
        password=data["password"]
    ) 

    if user is None : 
        return jsonify({
            "Error":"Email already exists"
        }),409 
    
    return jsonify({
        "message":"User registered successfully"
    }),201 

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user = login_user(
        email=data["email"],
        password=data["password"]
    )

    if user is None:
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "access_token": access_token
    }), 200

@auth_bp.route("/profile", methods = ["GET"])
@jwt_required()
def profile():

    current_user_id = get_jwt_identity()

    return jsonify({
        "message" : "Protected Route Accessed",
        "user_id" : current_user_id
    }),200