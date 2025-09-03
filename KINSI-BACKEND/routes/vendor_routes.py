from flask import Blueprint, request, jsonify
from db.KINSI import db
from models.vendors import Vendor
from sqlalchemy.exc import IntegrityError
from datetime import datetime

vendor_bp = Blueprint("vendor_bp", __name__)

@vendor_bp.route('/vendor/profile/<int:user_id>', methods=['GET'])
def get_vendor_profile(user_id):
    """Get vendor profile by user_id"""
    try:
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            return jsonify({
                "error": "Vendor profile not found", 
                "message": "No vendor profile exists for this user"
            }), 404
        
        return jsonify(vendor.to_dict()), 200
        
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@vendor_bp.route('/vendor/profile', methods=['POST'])
def create_or_update_vendor_profile():
    """Create or update vendor profile"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "user_id is required"}), 400
        
        # Check if vendor already exists
        existing_vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if existing_vendor:
            # Update existing vendor
            existing_vendor.business_name = data.get('business_name', existing_vendor.business_name)
            existing_vendor.owner_name = data.get('owner_name', existing_vendor.owner_name)
            existing_vendor.email = data.get('email', existing_vendor.email)
            existing_vendor.service_type = data.get('service_type', existing_vendor.service_type)
            existing_vendor.description = data.get('description', existing_vendor.description)
            existing_vendor.contact_phone = data.get('contact_phone', existing_vendor.contact_phone)
            existing_vendor.address = data.get('address', existing_vendor.address)
            existing_vendor.experience = data.get('experience', existing_vendor.experience)
            existing_vendor.website = data.get('website', existing_vendor.website)
            existing_vendor.instagram = data.get('instagram', existing_vendor.instagram)
            existing_vendor.facebook = data.get('facebook', existing_vendor.facebook)
            existing_vendor.twitter = data.get('twitter', existing_vendor.twitter)
            existing_vendor.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return jsonify({
                "message": "Vendor profile updated successfully", 
                "vendor_id": existing_vendor.id
            }), 200
        else:
            # Create new vendor
            new_vendor = Vendor(
                user_id=user_id,
                business_name=data.get('business_name', ''),
                owner_name=data.get('owner_name', ''),
                email=data.get('email', ''),
                service_type=data.get('service_type', ''),
                description=data.get('description', ''),
                contact_phone=data.get('contact_phone', ''),
                address=data.get('address', ''),
                experience=data.get('experience', ''),
                website=data.get('website', ''),
                instagram=data.get('instagram', ''),
                facebook=data.get('facebook', ''),
                twitter=data.get('twitter', '')
            )
            
            db.session.add(new_vendor)
            db.session.commit()
            
            return jsonify({
                "message": "Vendor profile created successfully", 
                "vendor_id": new_vendor.id
            }), 201
            
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Vendor profile already exists for this user"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@vendor_bp.route('/vendor/stats/<int:vendor_id>', methods=['GET'])
def get_vendor_stats(vendor_id):
    """Get vendor statistics"""
    try:
        from app.models.services import Service
        
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({"error": "Vendor not found"}), 404
        
        # Calculate stats from services
        services = Service.query.filter_by(vendor_id=vendor_id).all()
        
        stats = {
            "total_services": len(services),
            "total_views": sum(service.views for service in services),
            "total_inquiries": sum(service.inquiries for service in services),
            "total_bookings": sum(service.bookings for service in services)
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500