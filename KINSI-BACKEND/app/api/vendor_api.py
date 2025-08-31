from flask_restful import Resource, reqparse
from flask import request, jsonify
from app.models.vendors import Vendor, VendorService

class VendorProfileAPI(Resource):
    """RESTful API for vendor profile management"""
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        # Define expected arguments
        self.parser.add_argument('user_id', type=int, required=True, help='User ID is required')
        self.parser.add_argument('business_name', type=str, default='')
        self.parser.add_argument('service_type', type=str, default='')
        self.parser.add_argument('description', type=str, default='')
        self.parser.add_argument('contact_phone', type=str, default='')
        self.parser.add_argument('address', type=str, default='')
        self.parser.add_argument('owner_name', type=str, default='')
        self.parser.add_argument('email', type=str, default='')
        self.parser.add_argument('experience', type=str, default='')
        self.parser.add_argument('website', type=str, default='')
        self.parser.add_argument('instagram', type=str, default='')
        self.parser.add_argument('facebook', type=str, default='')
        self.parser.add_argument('twitter', type=str, default='')
    
    def get(self, user_id=None):
        """Get vendor profile by user_id"""
        if not user_id:
            return {'error': 'User ID is required'}, 400
        
        try:
            vendor = Vendor.get_by_user_id(user_id)
            if vendor:
                return {
                    'success': True,
                    'data': vendor,
                    'message': 'Vendor profile retrieved successfully'
                }, 200
            else:
                return {
                    'success': False,
                    'error': 'Vendor profile not found'
                }, 404
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500
    
    def post(self):
        """Create or update vendor profile"""
        try:
            args = self.parser.parse_args()
            user_id = args['user_id']
            
            # Check if vendor exists
            existing_vendor = Vendor.get_by_user_id(user_id)
            
            if existing_vendor:
                # Update existing vendor
                success = Vendor.update(
                    user_id=user_id,
                    business_name=args['business_name'],
                    service_type=args['service_type'],
                    description=args['description'],
                    contact_phone=args['contact_phone'],
                    address=args['address'],
                    owner_name=args['owner_name'],
                    email=args['email'],
                    experience=args['experience'],
                    website=args['website'],
                    instagram=args['instagram'],
                    facebook=args['facebook'],
                    twitter=args['twitter']
                )
                
                if success:
                    updated_vendor = Vendor.get_by_user_id(user_id)
                    return {
                        'success': True,
                        'data': updated_vendor,
                        'message': 'Vendor profile updated successfully',
                        'vendor_id': updated_vendor['id']
                    }, 200
                else:
                    return {
                        'success': False,
                        'error': 'Failed to update vendor profile'
                    }, 500
            else:
                # Create new vendor
                vendor_id = Vendor.create(
                    user_id=user_id,
                    business_name=args['business_name'],
                    service_type=args['service_type'],
                    description=args['description'],
                    contact_phone=args['contact_phone'],
                    address=args['address'],
                    owner_name=args['owner_name'],
                    email=args['email'],
                    experience=args['experience'],
                    website=args['website'],
                    instagram=args['instagram'],
                    facebook=args['facebook'],
                    twitter=args['twitter']
                )
                
                if vendor_id:
                    new_vendor = Vendor.get_by_id(vendor_id)
                    return {
                        'success': True,
                        'data': new_vendor,
                        'message': 'Vendor profile created successfully',
                        'vendor_id': vendor_id
                    }, 201
                else:
                    return {
                        'success': False,
                        'error': 'Failed to create vendor profile'
                    }, 500
                    
        except ValueError as e:
            return {
                'success': False,
                'error': str(e)
            }, 400
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500
    
    def put(self, user_id):
        """Update vendor profile"""
        try:
            args = self.parser.parse_args()
            args['user_id'] = user_id  # Override with URL parameter
            
            # Check if vendor exists
            existing_vendor = Vendor.get_by_user_id(user_id)
            if not existing_vendor:
                return {
                    'success': False,
                    'error': 'Vendor profile not found'
                }, 404
            
            success = Vendor.update(user_id=user_id, **args)
            
            if success:
                updated_vendor = Vendor.get_by_user_id(user_id)
                return {
                    'success': True,
                    'data': updated_vendor,
                    'message': 'Vendor profile updated successfully'
                }, 200
            else:
                return {
                    'success': False,
                    'error': 'Failed to update vendor profile'
                }, 500
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500
    
    def delete(self, user_id):
        """Soft delete vendor profile"""
        try:
            success = Vendor.delete(user_id)
            
            if success:
                return {
                    'success': True,
                    'message': 'Vendor profile deleted successfully'
                }, 200
            else:
                return {
                    'success': False,
                    'error': 'Vendor profile not found'
                }, 404
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500


class VendorServicesAPI(Resource):
    """RESTful API for vendor services management"""
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('vendor_id', type=int, required=True, help='Vendor ID is required')
        self.parser.add_argument('service_name', type=str, required=True, help='Service name is required')
        self.parser.add_argument('category', type=str, required=True, help='Category is required')
        self.parser.add_argument('price', type=float, required=True, help='Price is required')
        self.parser.add_argument('duration', type=str, default='')
        self.parser.add_argument('description', type=str, default='')
        self.parser.add_argument('features', type=list, location='json', default=[])
        self.parser.add_argument('currency', type=str, default='KSH')
        self.parser.add_argument('is_featured', type=bool, default=False)
    
    def get(self, vendor_id=None):
        """Get vendor services"""
        if not vendor_id:
            return {'error': 'Vendor ID is required'}, 400
        
        try:
            services = VendorService.get_by_vendor_id(vendor_id)
            return {
                'success': True,
                'data': services,
                'count': len(services),
                'message': 'Services retrieved successfully'
            }, 200
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500
    
    def post(self):
        """Create new service"""
        try:
            args = self.parser.parse_args()
            
            service_id = VendorService.create(
                vendor_id=args['vendor_id'],
                service_name=args['service_name'],
                category=args['category'],
                price=args['price'],
                duration=args['duration'],
                description=args['description'],
                features=args['features'],
                currency=args['currency']
            )
            
            if service_id:
                new_service = VendorService.get_by_id(service_id)
                return {
                    'success': True,
                    'data': new_service,
                    'message': 'Service created successfully',
                    'service_id': service_id
                }, 201
            else:
                return {
                    'success': False,
                    'error': 'Failed to create service'
                }, 500
                
        except ValueError as e:
            return {
                'success': False,
                'error': str(e)
            }, 400
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500


class VendorStatsAPI(Resource):
    """RESTful API for vendor statistics"""
    
    def get(self, vendor_id):
        """Get vendor statistics"""
        try:
            stats = VendorService.get_vendor_stats(vendor_id)
            return {
                'success': True,
                'data': stats,
                'message': 'Statistics retrieved successfully'
            }, 200
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500


class AllServicesAPI(Resource):
    """RESTful API for all services"""
    
    def get(self):
        """Get all services or search services"""
        try:
            # Check if this is a search request
            category = request.args.get('category')
            min_price = request.args.get('min_price')
            max_price = request.args.get('max_price')
            location = request.args.get('location')
            min_rating = request.args.get('min_rating')
            limit = request.args.get('limit', type=int)
            offset = request.args.get('offset', type=int)
            
            # Convert string parameters to appropriate types
            if min_price:
                try:
                    min_price = float(min_price)
                except (ValueError, TypeError):
                    return {
                        'success': False,
                        'error': 'min_price must be a valid number'
                    }, 400
            
            if max_price:
                try:
                    max_price = float(max_price)
                except (ValueError, TypeError):
                    return {
                        'success': False,
                        'error': 'max_price must be a valid number'
                    }, 400
                    
            if min_rating:
                try:
                    min_rating = float(min_rating)
                except (ValueError, TypeError):
                    return {
                        'success': False,
                        'error': 'min_rating must be a valid number'
                    }, 400
            
            # Check if any search parameters are provided
            search_params = [category, min_price, max_price, location, min_rating]
            if any(param is not None for param in search_params):
                # This is a search request
                services = VendorService.search_services(
                    category=category,
                    min_price=min_price,
                    max_price=max_price,
                    location=location,
                    min_rating=min_rating,
                    limit=limit,
                    offset=offset
                )
                message = 'Search results retrieved successfully'
            else:
                # Get all services
                services = VendorService.get_all(limit=limit, offset=offset)
                message = 'All services retrieved successfully'
            
            return {
                'success': True,
                'data': services,
                'count': len(services),
                'message': message
            }, 200
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500


class ServiceDetailsAPI(Resource):
    """RESTful API for individual service details"""
    
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('service_name', type=str)
        self.parser.add_argument('category', type=str)
        self.parser.add_argument('price', type=float)
        self.parser.add_argument('duration', type=str)
        self.parser.add_argument('description', type=str)
        self.parser.add_argument('features', type=list, location='json')
        self.parser.add_argument('currency', type=str)
        self.parser.add_argument('is_featured', type=bool)
        self.parser.add_argument('status', type=str)
    
    def get(self, service_id):
        """Get service details"""
        try:
            service = VendorService.get_by_id(service_id)
            if service:
                return {
                    'success': True,
                    'data': service,
                    'message': 'Service details retrieved successfully'
                }, 200
            else:
                return {
                    'success': False,
                    'error': 'Service not found'
                }, 404
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500
    
    def put(self, service_id):
        """Update service"""
        try:
            args = self.parser.parse_args()
            
            # Remove None values
            update_data = {k: v for k, v in args.items() if v is not None}
            
            success = VendorService.update(service_id, **update_data)
            
            if success:
                updated_service = VendorService.get_by_id(service_id)
                return {
                    'success': True,
                    'data': updated_service,
                    'message': 'Service updated successfully'
                }, 200
            else:
                return {
                    'success': False,
                    'error': 'Service not found or failed to update'
                }, 404
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500
    
    def delete(self, service_id):
        """Delete service"""
        try:
            success = VendorService.delete(service_id)
            
            if success:
                return {
                    'success': True,
                    'message': 'Service deleted successfully'
                }, 200
            else:
                return {
                    'success': False,
                    'error': 'Service not found'
                }, 404
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500


class ServiceInteractionAPI(Resource):
    """RESTful API for service interactions (views, inquiries, bookings)"""
    
    def post(self, service_id, interaction_type):
        """Increment interaction counters"""
        try:
            if interaction_type == 'view':
                success = VendorService.increment_views(service_id)
                message = 'View count updated'
            elif interaction_type == 'inquiry':
                success = VendorService.increment_inquiries(service_id)
                message = 'Inquiry count updated'
            elif interaction_type == 'booking':
                success = VendorService.increment_bookings(service_id)
                message = 'Booking count updated'
            else:
                return {
                    'success': False,
                    'error': 'Invalid interaction type. Use: view, inquiry, or booking'
                }, 400
            
            if success:
                return {
                    'success': True,
                    'message': message
                }, 200
            else:
                return {
                    'success': False,
                    'error': 'Service not found'
                }, 404
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Server error: {str(e)}'
            }, 500