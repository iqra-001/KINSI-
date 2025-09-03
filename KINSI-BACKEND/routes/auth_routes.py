from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from models.user import User
from models.tokenblocklist import TokenBlocklist
from db.KINSI import db
from datetime import datetime, timedelta
from utils.validators import validate_user_data

auth_bp = Blueprint('auth_bp', __name__)

# ==================== Home ====================
@auth_bp.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Wedding Vendor API!!"})

# ==================== Register ====================
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Username, email, and password are required"}), 400

    # 🔥 Run validators
    errors = validate_user_data(data)
    if errors:
        return jsonify({"errors": errors}), 400

    # Check if email already exists
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 400

    # Check if username already exists
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 400

    # Create new user
    user = User(
        username=data["username"].strip(),
        email=data["email"].strip(),
        role=data.get("role", "user")  # default role is "user"
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": user.to_dict()
    }), 201

# ==================== Login ====================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token (uses .env expiration automatically)
    access_token = create_access_token(identity=user.id)

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict()
    }), 200


# ==================== Logout ====================
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]  # JWT ID
    now = datetime.utcnow()
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"message": "Successfully logged out"}), 200

# ==================== Get Current User ====================
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200
