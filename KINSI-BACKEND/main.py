from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from routes.vendor_routes import vendor_bp
from config import config
import os
import sys

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Enable CORS for all routes
    CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"])
    
    # Import models after db initialization to avoid circular imports
    from models.vendors import Vendor, VendorService
    
    # Register blueprints
    app.register_blueprint(vendor_bp)
    
    # Only create tables if no migrations exist (for initial setup)
    with app.app_context():
        if not os.path.exists('migrations'):
            db.create_all()
            print("Tables created (no migrations found)")
        else:
            print("Migrations found - use 'flask db upgrade' to apply migrations")
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'KINSI API is running'
        }), 200
    
    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'Welcome to KINSI API',
            'version': '1.0.0',
            'endpoints': {
                'vendor_profile': '/vendor/profile',
                'vendor_services': '/vendor/services',
                'health': '/health'
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    return app

# Create the Flask app
app = create_app()

if __name__ == '__main__':
    print("Starting KINSI API server...")
    print("Available endpoints:")
    print("- GET /health - Health check")
    print("- GET / - API information") 
    print("- POST /vendor/profile - Create/Update vendor profile")
    print("- GET /vendor/profile/<user_id> - Get vendor profile")
    print("- POST /vendor/services - Add vendor service")
    print("- GET /vendor/services/<vendor_id> - Get vendor services")
    print("- GET /vendor/stats/<vendor_id> - Get vendor statistics")
    print("- GET /vendor/all - Get all vendors")
    print("\nFrontend should connect to: http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)