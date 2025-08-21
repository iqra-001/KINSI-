from flask import request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from . import bp
from .. import db
from ..models import User, UserActivity
from ..utils.decorators import validate_json, log_user_activity
from ..utils.security import rate_limit
from datetime import datetime, timedelta

@bp.route('/signup', methods=['POST'])
@validate_json(['username', 'email', 'password'])
def signup():
    data = request.get_json()
    username = data.get('username', '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    errors = []
    if len(username) < 3 or len(username) > 50:
        errors.append("Username must be between 3 and 50 characters")
    if not User.is_valid_email(email):
        errors.append("Invalid email format")
    if not User.is_valid_password(password):
        errors.append("Password must be at least 8 characters and include upper, lower and number")
    if User.query.filter_by(username=username).first():
        errors.append("Username already exists")
    if User.query.filter_by(email=email).first():
        errors.append("Email already registered")
    if errors:
        return jsonify({'error': 'Validation failed', 'details': errors}), 400

    user = User(
        username=username,
        email=email,
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        phone_number=data.get('phone_number', '')
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    db.session.add(UserActivity(user_id=user.id, action='USER_REGISTERED', ip_address=request.remote_addr, details='New user registration'))
    db.session.commit()

    return jsonify({'success': True, 'message': 'User registered successfully', 'user': user.to_dict()}), 201

@bp.route('/login', methods=['POST'])
@validate_json(['email', 'password'])
@rate_limit(max_requests=5, per_minutes=15)
def login():
    data = request.get_json()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid email or password'}), 401
    if not user.is_active:
        return jsonify({'error': 'Account disabled'}), 403

    login_user(user, remember=True, duration=timedelta(days=7))
    user.last_login = datetime.utcnow()
    db.session.commit()

    db.session.add(UserActivity(user_id=user.id, action='USER_LOGGED_IN', ip_address=request.remote_addr, details='Login success'))
    db.session.commit()

    return jsonify({'success': True, 'message': 'Logged in', 'user': user.to_dict()})

@bp.route('/logout', methods=['POST'])
@login_required
@log_user_activity('USER_LOGGED_OUT')
def logout():
    logout_user()
    return jsonify({'success': True, 'message': 'Logged out'})

@bp.route('/me', methods=['GET'])
@login_required
def me():
    return jsonify({'user': current_user.to_dict()})

@bp.route('/me', methods=['PUT'])
@login_required
def update_me():
    data = request.get_json(silent=True) or {}
    fields = ['first_name', 'last_name', 'phone_number', 'profile_image']
    for f in fields:
        if f in data:
            setattr(current_user, f, data[f])
    db.session.commit()
    return jsonify({'success': True, 'user': current_user.to_dict()})

@bp.route('/change-password', methods=['POST'])
@login_required
@validate_json(['old_password', 'new_password'])
def change_password():
    data = request.get_json()
    if not current_user.check_password(data['old_password']):
        return jsonify({'error': 'Old password incorrect'}), 400
    if not User.is_valid_password(data['new_password']):
        return jsonify({'error': 'New password too weak'}), 400
    current_user.set_password(data['new_password'])
    db.session.commit()
    return jsonify({'success': True, 'message': 'Password changed'})
