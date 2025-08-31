from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
import os
from app import db, migrate, api

# Initialize extensions
# db = SQLAlchemy()
migrate = Migrate()
api = Api()

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Configuration
    if config_name == 'production':
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///kinsi_production.db')
        app.config['DEBUG'] = False
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///kinsi_development.db'
        app.config['DEBUG'] = True
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-this-in-production')
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    api.init_app(app)
    
    # Enable CORS for all routes
    CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"])
    
    # Import models and routes within app context to avoid circular imports
    with app.app_context():
        from app.models.vendors import Vendor, VendorService
        from app.routes.vendor_routes import vendor_bp
        
        # Register blueprints
        app.register_blueprint(vendor_bp)
        
        # Register RESTful API resources
        from app.api.vendor_api import (
            VendorProfileAPI, 
            VendorServicesAPI, 
            VendorStatsAPI, 
            AllServicesAPI,
            ServiceDetailsAPI,
            ServiceInteractionAPI
        )
        
        api.add_resource(VendorProfileAPI, '/api/vendor/profile', '/api/vendor/profile/<int:user_id>')
        api.add_resource(VendorServicesAPI, '/api/vendor/services', '/api/vendor/services/<int:vendor_id>')
        api.add_resource(VendorStatsAPI, '/api/vendor/stats/<int:vendor_id>')
        api.add_resource(AllServicesAPI, '/api/services/all', '/api/services/search')
        api.add_resource(ServiceDetailsAPI, '/api/service/<int:service_id>')
        api.add_resource(ServiceInteractionAPI, '/api/service/<int:service_id>/<string:interaction_type>')
        
        # Create tables only if no migrations exist
        if not os.path.exists('migrations'):
            db.create_all()
            print("✓ Database tables created (no migrations found)")
        else:
            print("✓ Migrations directory found - use 'flask db upgrade' to apply migrations")
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        try:
            # Test database connection
            db.session.execute('SELECT 1')
            db_status = 'connected'
        except Exception:
            db_status = 'disconnected'
            
        return jsonify({
            'status': 'healthy',
            'message': 'KINSI API is running',
            'database': db_status,
            'version': '1.0.0'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'Welcome to KINSI Vendor API',
            'version': '1.0.0',
            'status': 'active',
            'documentation': {
                'health_check': 'GET /health',
                'vendor_management': {
                    'create_profile': 'POST /vendor/profile',
                    'get_profile': 'GET /vendor/profile/<user_id>',
                    'update_profile': 'PUT /vendor/profile/<user_id>',
                    'get_all_vendors': 'GET /vendor/all',
                    'search_vendors': 'GET /vendor/search'
                },
                'service_management': {
                    'add_service': 'POST /vendor/services',
                    'get_services': 'GET /vendor/services/<vendor_id>',
                    'update_service': 'PUT /vendor/service/<service_id>',
                    'delete_service': 'DELETE /vendor/service/<service_id>',
                    'get_service_details': 'GET /service/<service_id>'
                },
                'public_services': {
                    'all_services': 'GET /services/all',
                    'search_services': 'GET /services/search',
                    'featured_services': 'GET /services/featured',
                    'categories': 'GET /services/categories'
                },
                'analytics': {
                    'vendor_stats': 'GET /vendor/stats/<vendor_id>',
                    'increment_views': 'POST /service/<service_id>/view',
                    'increment_inquiries': 'POST /service/<service_id>/inquiry',
                    'increment_bookings': 'POST /service/<service_id>/booking'
                },
                'restful_api': {
                    'vendor_profile': '/api/vendor/profile',
                    'vendor_services': '/api/vendor/services',
                    'vendor_stats': '/api/vendor/stats/<vendor_id>',
                    'all_services': '/api/services/all',
                    'service_details': '/api/service/<service_id>',
                    'service_interactions': '/api/service/<service_id>/<interaction_type>'
                }
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Endpoint not found',
            'message': 'The requested resource does not exist',
            'status_code': 404
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Internal server error',
            'message': 'An unexpected error occurred',
            'status_code': 500
        }), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad request',
            'message': 'The request was invalid or cannot be served',
            'status_code': 400
        }), 400
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            'error': 'Method not allowed',
            'message': 'The method is not allowed for the requested URL',
            'status_code': 405
        }), 405
    
    return app

# Create the Flask app
app = create_app()

if __name__ == '__main__':
    print("🚀 Starting KINSI Vendor API server...")
    print("\n📋 Available Traditional Endpoints:")
    print("   Health & Info:")
    print("   - GET  /health                     - Health check")
    print("   - GET  /                           - API information")
    print("\n   Vendor Management:")
    print("   - POST /vendor/profile             - Create/Update vendor profile")
    print("   - GET  /vendor/profile/<user_id>   - Get vendor profile")
    print("   - GET  /vendor/all                 - Get all vendors")
    print("   - GET  /vendor/search              - Search vendors")
    print("\n   Service Management:")
    print("   - POST /vendor/services            - Add vendor service")
    print("   - GET  /vendor/services/<vendor_id> - Get vendor services")
    print("   - PUT  /vendor/service/<service_id> - Update service")
    print("   - DELETE /vendor/service/<service_id> - Delete service")
    print("   - GET  /service/<service_id>       - Get service details")
    print("\n   Public Services:")
    print("   - GET  /services/all               - Get all services")
    print("   - GET  /services/search            - Search services with filters")
    print("   - GET  /services/featured          - Get featured services")
    print("   - GET  /services/categories        - Get service categories")
    print("\n   Analytics:")
    print("   - GET  /vendor/stats/<vendor_id>   - Get vendor statistics")
    print("   - POST /service/<service_id>/view  - Increment views")
    print("   - POST /service/<service_id>/inquiry - Increment inquiries")
    print("   - POST /service/<service_id>/booking - Increment bookings")
    print("\n🔄 RESTful API Endpoints:")
    print("   - GET/POST /api/vendor/profile     - RESTful vendor profile")
    print("   - GET/POST /api/vendor/services    - RESTful vendor services")
    print("   - GET /api/vendor/stats/<vendor_id> - RESTful vendor stats")
    print("   - GET /api/services/all            - RESTful all services")
    print("   - GET/PUT/DELETE /api/service/<id> - RESTful service details")
    print("   - POST /api/service/<id>/<type>    - RESTful service interactions")
    print("\n🌐 Frontend Connection:")
    print("   Your React app should connect to: http://localhost:5000")
    print("📊 Database: SQLite (kinsi_development.db)")
    print("🔧 Debug mode: ON")
    print("🔐 CORS enabled for: localhost:3000, localhost:5173")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        print(f"\n❌ Error starting server: {str(e)}")
        print("💡 Try running: pip install -r requirements.txt")
        print("💡 Or check if port 5000 is already in use")