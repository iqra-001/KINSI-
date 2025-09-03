from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import jsonify
from models.user import User

def role_required(roles):
    """
    Restrict route access to users with specific roles.
    Usage:
        @role_required(["admin", "vendor"])
    """
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user:
                return jsonify({"error": "User not found"}), 404

            if user.role.lower() not in [r.lower() for r in roles]:
                return jsonify({
                    "error": "Access forbidden: insufficient permissions."
                }), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator
