from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from models.vendors import Vendor, VendorService
from sqlalchemy.exc import IntegrityError
import json

vendor_bp = Blueprint('vendor', __name__)

@vendor_bp.route('/vendor/profile', methods=['POST'])
@cross_origin()
def create_or_update_vendor_profile():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # Check if vendor profile already exists
        existing_vendor = Vendor.get_by_user_id(user_id)
        
        if existing_vendor:
            # Update existing vendor profile
            success = Vendor.update(
                user_id=user_id,
                business_name=data.get('business_name', ''),
                service_type=data.get('service_type', ''),
                description=data.get('description', ''),
                contact_phone=data.get('contact_phone', ''),
                address=data.get('address', ''),
                owner_name=data.get('owner_name', ''),
                email=data.get('email', ''),
                experience=data.get('experience', ''),
                website=data.get('website', ''),
                instagram=data.get('instagram', ''),
                facebook=data.get('facebook', ''),
                twitter=data.get('twitter', '')
            )
            
            if success:
                return jsonify({
                    'message': 'Vendor profile updated successfully', 
                    'vendor_id': existing_vendor['id']
                }), 200
            else:
                return jsonify({'error': 'Failed to update vendor profile'}), 500
        else:
            # Create new vendor profile
            try:
                vendor_id = Vendor.create(
                    user_id=user_id,
                    business_name=data.get('business_name', ''),
                    service_type=data.get('service_type', ''),
                    description=data.get('description', ''),
                    contact_phone=data.get('contact_phone', ''),
                    address=data.get('address', ''),
                    owner_name=data.get('owner_name', ''),
                    email=data.get('email', ''),
                    experience=data.get('experience', ''),
                    website=data.get('website', ''),
                    instagram=data.get('instagram', ''),
                    facebook=data.get('facebook', ''),
                    twitter=data.get('twitter', '')
                )
                
                if vendor_id:
                    return jsonify({
                        'message': 'Vendor profile created successfully', 
                        'vendor_id': vendor_id
                    }), 201
                else:
                    return jsonify({'error': 'Failed to create vendor profile'}), 500
                    
            except Exception as e:
                if "UNIQUE constraint failed" in str(e) or "already exists" in str(e):
                    return jsonify({'error': 'A vendor profile already exists for this user'}), 400
                else:
                    return jsonify({'error': f'Database error: {str(e)}'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/vendor/profile/<int:user_id>', methods=['GET'])
@cross_origin()
def get_vendor_profile(user_id):
    try:
        vendor = Vendor.get_by_user_id(user_id)
        if vendor:
            return jsonify(vendor), 200
        else:
            return jsonify({'error': 'Vendor profile not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/vendor/services', methods=['POST'])
@cross_origin()
def add_vendor_service():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        required_fields = ['vendor_id', 'service_name', 'category', 'price']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate price is numeric
        try:
            price = float(data.get('price'))
        except (ValueError, TypeError):
            return jsonify({'error': 'Price must be a valid number'}), 400
        
        service_id = VendorService.create(
            vendor_id=data.get('vendor_id'),
            service_name=data.get('service_name'),
            category=data.get('category'),
            price=price,
            duration=data.get('duration', ''),
            description=data.get('description', ''),
            features=data.get('features', [])
        )
        
        if service_id:
            return jsonify({'message': 'Service added successfully', 'service_id': service_id}), 201
        else:
            return jsonify({'error': 'Failed to create service'}), 500
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/vendor/services/<int:vendor_id>', methods=['GET'])
@cross_origin()
def get_vendor_services(vendor_id):
    try:
        services = VendorService.get_by_vendor_id(vendor_id)
        return jsonify(services), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/vendor/stats/<int:vendor_id>', methods=['GET'])
@cross_origin()
def get_vendor_stats(vendor_id):
    try:
        stats = VendorService.get_vendor_stats(vendor_id)
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/vendor/service/<int:service_id>', methods=['PUT'])
@cross_origin()
def update_vendor_service(service_id):
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate price if provided
        if 'price' in data:
            try:
                data['price'] = float(data['price'])
            except (ValueError, TypeError):
                return jsonify({'error': 'Price must be a valid number'}), 400
        
        success = VendorService.update(
            service_id=service_id,
            service_name=data.get('service_name'),
            category=data.get('category'),
            price=data.get('price'),
            duration=data.get('duration'),
            description=data.get('description'),
            features=data.get('features')
        )
        
        if success:
            return jsonify({'message': 'Service updated successfully'}), 200
        else:
            return jsonify({'error': 'Service not found or failed to update'}), 404
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/vendor/service/<int:service_id>', methods=['DELETE'])
@cross_origin()
def delete_vendor_service(service_id):
    try:
        success = VendorService.delete(service_id)
        
        if success:
            return jsonify({'message': 'Service deleted successfully'}), 200
        else:
            return jsonify({'error': 'Service not found or failed to delete'}), 404
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/vendor/all', methods=['GET'])
@cross_origin()
def get_all_vendors():
    try:
        vendors = Vendor.get_all()
        return jsonify(vendors), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/services/all', methods=['GET'])
@cross_origin()
def get_all_services():
    """Get all services across all vendors"""
    try:
        services = VendorService.get_all()
        return jsonify(services), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/services/search', methods=['GET'])
@cross_origin()
def search_services():
    """Search services with filters"""
    try:
        category = request.args.get('category')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        location = request.args.get('location')
        
        # Convert price parameters to float if provided
        if min_price:
            try:
                min_price = float(min_price)
            except (ValueError, TypeError):
                return jsonify({'error': 'min_price must be a valid number'}), 400
        
        if max_price:
            try:
                max_price = float(max_price)
            except (ValueError, TypeError):
                return jsonify({'error': 'max_price must be a valid number'}), 400
        
        services = VendorService.search_services(
            category=category,
            min_price=min_price,
            max_price=max_price,
            location=location
        )
        
        return jsonify(services), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/service/<int:service_id>/view', methods=['POST'])
@cross_origin()
def increment_service_views(service_id):
    """Increment view count for a service"""
    try:
        success = VendorService.increment_views(service_id)
        if success:
            return jsonify({'message': 'View count updated'}), 200
        else:
            return jsonify({'error': 'Service not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/service/<int:service_id>/inquiry', methods=['POST'])
@cross_origin()
def increment_service_inquiries(service_id):
    """Increment inquiry count for a service"""
    try:
        success = VendorService.increment_inquiries(service_id)
        if success:
            return jsonify({'message': 'Inquiry count updated'}), 200
        else:
            return jsonify({'error': 'Service not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/service/<int:service_id>/booking', methods=['POST'])
@cross_origin()
def increment_service_bookings(service_id):
    """Increment booking count for a service"""
    try:
        success = VendorService.increment_bookings(service_id)
        if success:
            return jsonify({'message': 'Booking count updated'}), 200
        else:
            return jsonify({'error': 'Service not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@vendor_bp.route('/service/<int:service_id>', methods=['GET'])
@cross_origin()
def get_service_details(service_id):
    """Get detailed information about a specific service"""
    try:
        service = VendorService.get_by_id(service_id)
        if service:
            return jsonify(service), 200
        else:
            return jsonify({'error': 'Service not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500