from functools import wraps
from flask import jsonify, request
from flask_login import current_user

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({'error': 'Authentication required'}), 401
        if current_user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated

def validate_json(required_fields=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not request.is_json:
                return jsonify({'error': 'Content-Type must be application/json'}), 400
            data = request.get_json(silent=True) or {}
            missing = [fld for fld in (required_fields or []) if fld not in data]
            if missing:
                return jsonify({'error': 'Missing required fields', 'missing_fields': missing}), 400
            return f(*args, **kwargs)
        return decorated
    return decorator

def log_user_activity(action):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            from .. import db
            from ..models import UserActivity
            result = f(*args, **kwargs)
            try:
                if current_user.is_authenticated:
                    act = UserActivity(
                        user_id=current_user.id,
                        action=action,
                        ip_address=request.remote_addr,
                        details=f"Endpoint: {request.path} Method: {request.method}"
                    )
                    db.session.add(act)
                    db.session.commit()
            except Exception:
                db.session.rollback()
            return result
        return decorated
    return decorator
