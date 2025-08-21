from flask import jsonify
from flask_login import login_required, current_user
from . import bp
from ..models import UserActivity

@bp.route('/dashboard', methods=['GET'])
@login_required
def dashboard():
    activity_count = UserActivity.query.filter_by(user_id=current_user.id).count()
    return jsonify({
        'success': True,
        'message': f'Welcome {current_user.username}',
        'stats': {'activity_count': activity_count}
    })

@bp.route('/profile', methods=['GET'])
@login_required
def profile():
    return jsonify({'success': True, 'profile': current_user.to_dict()})

@bp.route('/activities', methods=['GET'])
@login_required
def activities():
    acts = UserActivity.query.filter_by(user_id=current_user.id).order_by(UserActivity.timestamp.desc()).limit(50).all()
    return jsonify({'success': True, 'activities': [
        {'action': a.action, 'details': a.details, 'timestamp': a.timestamp.isoformat()} for a in acts
    ]})

@bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200
