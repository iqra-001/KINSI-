from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from models.user import User
from models.vendors import Vendor
from models.user_profile import UserProfile
from models.tokenblocklist import TokenBlocklist
from db.KINSI import db
from datetime import datetime
from utils.validators import validate_user_data

# Google OAuth imports
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

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

    errors = validate_user_data(data)
    if errors:
        return jsonify({"errors": errors}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 400

    role = data.get("role", "user")

    # Create base User
    user = User(
        username=data["username"].strip(),
        email=data["email"].strip(),
        role=role
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.flush()  # get user.id

    # Create extra table depending on role
    if role == "vendor":
        vendor = Vendor(
            user_id=user.id,
            business_name=data.get("business_name", ""),
            owner_name=data.get("owner_name", ""),
            business_email=data.get("business_email", ""),
            service_type=data.get("service_type", ""),
            description=data.get("description", ""),
            contact_phone=data.get("contact_phone", ""),
            address=data.get("address", ""),
            experience=data.get("experience", ""),
            website=data.get("website", ""),
            instagram=data.get("instagram", ""),
            facebook=data.get("facebook", ""),
            twitter=data.get("twitter", "")
        )
        db.session.add(vendor)
    else:  # Normal user
        profile = UserProfile(
            user_id=user.id,
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
            phone=data.get("phone", ""),
            location=data.get("location", ""),
            bio=data.get("bio", ""),
            profile_image=data.get("profile_image", "")
        )
        db.session.add(profile)

    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": user.to_dict(),
        "vendor": user.vendor.to_dict() if user.vendor else None,
        "profile": user.profile.to_dict() if user.profile else None
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


# ==================== Google Login/Signup ====================
@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get("token")

    if not token:
        return jsonify({"error": "Missing Google token"}), 400

    try:
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(token, grequests.Request())

        email = idinfo["email"]
        username = idinfo.get("name", email.split("@")[0])

        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            # Auto-create user if they don’t exist
            user = User(username=username, email=email, role="user")
            db.session.add(user)
            db.session.commit()

        # Generate token
        access_token = create_access_token(identity=user.id)

        return jsonify({
            "message": "Google login successful",
            "access_token": access_token,
            "user": user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": "Invalid Google token", "details": str(e)}), 400


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

    # Fetch related profile & vendor
    profile = UserProfile.query.filter_by(user_id=user.id).first()
    vendor = Vendor.query.filter_by(user_id=user.id).first()

    return jsonify({
        "user": user.to_dict(),
        "profile": profile.to_dict() if profile else None,
        "vendor": vendor.to_dict() if vendor else None
    }), 200