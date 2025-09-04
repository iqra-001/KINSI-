# routes/user_dashboard.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_profile import UserProfile
from models.user_event import UserEvent
from models.user_payment import UserPaymentMethod
from db.KINSI import db
from datetime import datetime
import re

user_dashboard_bp = Blueprint('user_dashboard_bp', __name__)

# ==================== User Profile Management ====================
@user_dashboard_bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({"message": "Profile not found"}), 404
        return jsonify({"profile": profile.to_dict()}), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        # Find or create profile
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not profile:
            profile = UserProfile(user_id=user_id)
            db.session.add(profile)
        
        # Update fields
        if 'first_name' in data:
            profile.first_name = data['first_name']
        if 'last_name' in data:
            profile.last_name = data['last_name']
        if 'phone' in data:
            profile.phone = data['phone']
        if 'location' in data:
            profile.location = data['location']
        if 'bio' in data:
            profile.bio = data['bio']
        if 'profile_image' in data:
            profile.profile_image = data['profile_image']
            
        try:
            db.session.commit()
            return jsonify({
                "message": "Profile updated successfully", 
                "profile": profile.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error updating profile: {str(e)}"}), 500

# ==================== User Events ====================
@user_dashboard_bp.route('/events', methods=['GET', 'POST'])
@jwt_required()
def user_events():
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        events = UserEvent.query.filter_by(user_id=user_id).all()
        return jsonify({"events": [event.to_dict() for event in events]}), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['event_name', 'event_type', 'date', 'budget', 'guests']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400
                
        try:
            event_date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({"error": "Invalid date format. Use ISO format"}), 400
            
        event = UserEvent(
            user_id=user_id,
            event_name=data['event_name'],
            event_type=data['event_type'],
            date=event_date,
            budget=float(data['budget']),
            guests=int(data['guests']),
            description=data.get('description', '')
        )
        
        try:
            db.session.add(event)
            db.session.commit()
            return jsonify({
                "message": "Event created successfully", 
                "event": event.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error creating event: {str(e)}"}), 500

@user_dashboard_bp.route('/events/<string:event_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user_event_detail(event_id):
    user_id = get_jwt_identity()
    event = UserEvent.query.filter_by(id=event_id, user_id=user_id).first()
    
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    if request.method == 'GET':
        return jsonify({"event": event.to_dict()}), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        if 'event_name' in data:
            event.event_name = data['event_name']
        if 'event_type' in data:
            event.event_type = data['event_type']
        if 'date' in data:
            try:
                event.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({"error": "Invalid date format. Use ISO format"}), 400
        if 'budget' in data:
            event.budget = float(data['budget'])
        if 'guests' in data:
            event.guests = int(data['guests'])
        if 'description' in data:
            event.description = data['description']
            
        try:
            db.session.commit()
            return jsonify({
                "message": "Event updated successfully", 
                "event": event.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error updating event: {str(e)}"}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(event)
            db.session.commit()
            return jsonify({"message": "Event deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error deleting event: {str(e)}"}), 500

# ==================== Payment Methods ====================
@user_dashboard_bp.route('/payment-methods', methods=['GET', 'POST'])
@jwt_required()
def user_payment_methods():
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        payment_methods = UserPaymentMethod.query.filter_by(user_id=user_id).all()
        return jsonify({"payment_methods": [pm.to_dict() for pm in payment_methods]}), 200
    
    elif request.method == 'POST':
        data = request.get_json()
        
        if 'method_type' not in data:
            return jsonify({"error": "method_type is required"}), 400
            
        if data['method_type'] not in ['card', 'mpesa']:
            return jsonify({"error": "method_type must be either 'card' or 'mpesa'"}), 400
            
        # Validate based on method type
        if data['method_type'] == 'card':
            required_fields = ['card_number', 'card_name', 'expiry_date']
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"{field} is required for card payments"}), 400
                    
            # Basic card validation
            if len(data['card_number'].replace(' ', '')) < 13:
                return jsonify({"error": "Invalid card number"}), 400
                
        elif data['method_type'] == 'mpesa':
            if 'mpesa_number' not in data:
                return jsonify({"error": "mpesa_number is required for M-Pesa payments"}), 400
                
            # Basic phone validation for Kenya
            mpesa_number = data['mpesa_number'].replace(' ', '').replace('+', '')
            if not (mpesa_number.startswith('254') and len(mpesa_number) == 12):
                return jsonify({"error": "Invalid M-Pesa number. Use format 2547XXXXXXXX"}), 400
                
        # If setting as default, remove default from other payment methods
        if data.get('is_default', False):
            UserPaymentMethod.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})
            
        payment_method = UserPaymentMethod(
            user_id=user_id,
            method_type=data['method_type'],
            card_number=data.get('card_number', ''),
            card_name=data.get('card_name', ''),
            expiry_date=data.get('expiry_date', ''),
            mpesa_number=data.get('mpesa_number', ''),
            is_default=data.get('is_default', False)
        )
        
        try:
            db.session.add(payment_method)
            db.session.commit()
            return jsonify({
                "message": "Payment method added successfully", 
                "payment_method": payment_method.to_dict()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error adding payment method: {str(e)}"}), 500

@user_dashboard_bp.route('/payment-methods/<string:payment_method_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def user_payment_method_detail(payment_method_id):
    user_id = get_jwt_identity()
    payment_method = UserPaymentMethod.query.filter_by(id=payment_method_id, user_id=user_id).first()
    
    if not payment_method:
        return jsonify({"error": "Payment method not found"}), 404
    
    if request.method == 'GET':
        return jsonify({"payment_method": payment_method.to_dict()}), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        # If setting as default, remove default from other payment methods
        if data.get('is_default', False):
            UserPaymentMethod.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})
            
        if 'card_number' in data:
            payment_method.card_number = data['card_number']
        if 'card_name' in data:
            payment_method.card_name = data['card_name']
        if 'expiry_date' in data:
            payment_method.expiry_date = data['expiry_date']
        if 'mpesa_number' in data:
            payment_method.mpesa_number = data['mpesa_number']
        if 'is_default' in data:
            payment_method.is_default = data['is_default']
            
        try:
            db.session.commit()
            return jsonify({
                "message": "Payment method updated successfully", 
                "payment_method": payment_method.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error updating payment method: {str(e)}"}), 500
    
    elif request.method == 'DELETE':
        try:
            db.session.delete(payment_method)
            db.session.commit()
            return jsonify({"message": "Payment method deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error deleting payment method: {str(e)}"}), 500

# ==================== Dashboard Overview ====================
@user_dashboard_bp.route('/overview', methods=['GET'])
@jwt_required()
def dashboard_overview():
    user_id = get_jwt_identity()
    
    # Get counts for dashboard stats
    events_count = UserEvent.query.filter_by(user_id=user_id).count()
    payment_methods_count = UserPaymentMethod.query.filter_by(user_id=user_id).count()
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    profile_complete = bool(profile and (
        profile.first_name or profile.last_name or 
        profile.phone or profile.location or profile.bio
    ))
    
    # Get recent events
    recent_events = UserEvent.query.filter_by(user_id=user_id)\
        .order_by(UserEvent.created_at.desc()).limit(3).all()
    
    return jsonify({
        "stats": {
            "events_count": events_count,
            "payment_methods_count": payment_methods_count,
            "profile_complete": profile_complete,
            "happy_moments": events_count > 0
        },
        "recent_events": [event.to_dict() for event in recent_events]
    }), 200