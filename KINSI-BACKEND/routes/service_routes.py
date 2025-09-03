from flask import Blueprint, request, jsonify
from db.KINSI import db
from models.services import Service
from models.vendors import Vendor
import json

service_bp = Blueprint("service_bp", __name__)

@service_bp.route('/vendor/services/<int:vendor_id>', methods=['GET'])
def get_vendor_services(vendor_id):
    """Get all services for a vendor"""
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({"error": "Vendor not found"}), 404
        
        services = Service.query.filter_by(vendor_id=vendor_id, is_active=True).all()
        return jsonify([service.to_dict() for service in services]), 200
        
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@service_bp.route('/vendor/services', methods=['POST'])
def create_vendor_service():
    """Create a new service for a vendor"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        vendor_id = data.get('vendor_id')
        if not vendor_id:
            return jsonify({"error": "vendor_id is required"}), 400
        
        # Check if vendor exists
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({"error": "Vendor not found"}), 404
        
        # Create new service
        new_service = Service(
            vendor_id=vendor_id,
            service_name=data.get('service_name', ''),
            category=data.get('category', ''),
            price=float(data.get('price', 0)),
            duration=data.get('duration', ''),
            description=data.get('description', ''),
            features=json.dumps(data.get('features', []))
        )
        
        db.session.add(new_service)
        db.session.commit()
        
        return jsonify({
            "message": "Service created successfully",
            "service_id": new_service.id,
            "service": new_service.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@service_bp.route('/vendor/services/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    """Update a service"""
    try:
        service = Service.query.get_or_404(service_id)
        data = request.get_json()
        
        service.service_name = data.get('service_name', service.service_name)
        service.category = data.get('category', service.category)
        service.price = float(data.get('price', service.price))
        service.duration = data.get('duration', service.duration)
        service.description = data.get('description', service.description)
        service.features = json.dumps(data.get('features', json.loads(service.features or '[]')))
        
        db.session.commit()
        
        return jsonify({
            "message": "Service updated successfully",
            "service": service.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@service_bp.route('/vendor/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    """Delete a service"""
    try:
        service = Service.query.get_or_404(service_id)
        db.session.delete(service)
        db.session.commit()
        
        return jsonify({"message": "Service deleted successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500