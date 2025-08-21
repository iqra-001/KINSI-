from flask import jsonify, request, current_app
from flask_login import login_required, current_user
from . import bp
from .. import db
from ..models import User, UserActivity
from ..utils.decorators import admin_required, log_user_activity
from datetime import datetime, timedelta

@bp.route('/dashboard', methods=['GET'])
@login_required
@admin_required
def admin_dashboard():
    try:
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        admin_users = User.query.filter_by(role='admin').count()

        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_registrations = User.query.filter(User.created_at >= thirty_days_ago).count()

        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_activities = UserActivity.query.filter(UserActivity.timestamp >= yesterday).count()

        stats = {
            'total_users': total_users,
            'active_users': active_users,
            'admin_users': admin_users,
            'recent_registrations': recent_registrations,
            'recent_activities': recent_activities,
            'inactive_users': total_users - active_users
        }
        return jsonify({'success': True, 'message': 'Welcome to Admin Dashboard', 'stats': stats}), 200
    except Exception as e:
        current_app.logger.error(f"Admin dashboard error: {str(e)}")
        return jsonify({'error': 'Failed to load admin dashboard'}), 500

@bp.route('/users', methods=['GET'])
@login_required
@admin_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    q = request.args.get('q', '', type=str)

    query = User.query
    if q:
        like = f"%{q}%"
        query = query.filter(db.or_(User.username.like(like), User.email.like(like)))

    pagination = query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'success': True,
        'users': [u.to_dict() for u in pagination.items],
        'pagination': {'page': page, 'per_page': per_page, 'total': pagination.total, 'pages': pagination.pages}
    })

@bp.route('/users/<int:user_id>', methods=['GET'])
@login_required
@admin_required
def get_user_details(user_id):
    user = User.query.get_or_404(user_id)
    acts = UserActivity.query.filter_by(user_id=user_id).order_by(UserActivity.timestamp.desc()).limit(50).all()
    return jsonify({'success': True, 'user': user.to_dict(), 'recent_activities': [
        {'action': a.action, 'timestamp': a.timestamp.isoformat(), 'details': a.details} for a in acts
    ]})

@bp.route('/users/<int:user_id>/toggle-status', methods=['PUT'])
@login_required
@admin_required
@log_user_activity('USER_STATUS_TOGGLE')
def toggle_user_status(user_id):
    user = User.query.get_or_404(user_id)
    if user.id == current_user.id:
        return jsonify({'error': 'Cannot deactivate your own account'}), 400
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({'success': True, 'is_active': user.is_active})

@bp.route('/users/<int:user_id>/role', methods=['PUT'])
@login_required
@admin_required
@log_user_activity('USER_ROLE_CHANGED')
def change_role(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json(silent=True) or {}
    role = data.get('role')
    if role not in ('user', 'admin', 'moderator'):
        return jsonify({'error': 'Invalid role'}), 400
    user.role = role
    db.session.commit()
    return jsonify({'success': True, 'role': user.role})

@bp.route('/users/<int:user_id>', methods=['DELETE'])
@login_required
@admin_required
@log_user_activity('USER_DELETED')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': True})
