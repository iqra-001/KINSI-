from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from utils.auth_utils import role_required
from db.KINSI import db

user_bp = Blueprint('user_bp', __name__)

# ==================== Current User ====================
@user_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Return details of the currently logged-in user"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

# ==================== Get a user by username ====================
@user_bp.route('/username/<string:username>', methods=['GET'])
@jwt_required()
def get_user_by_username(username):
    """Fetch a user by username"""
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

# ==================== User Dashboard ====================
@user_bp.route('/dummy-user', methods=['GET'])
@role_required(["user"])
def user_dashboard():
    """User-only endpoint"""
    return jsonify({"message": "Welcome, User!"}), 200
    
# ==================== Vendor Dashboard ====================
@user_bp.route('/dummy-vendor', methods=['GET'])
@role_required(["vendor"])
def vendor_dashboard():
    """Vendor-only endpoint"""
    return jsonify({"message": "Welcome, Vendor!"}), 200