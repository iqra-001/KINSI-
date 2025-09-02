# app.py
from app import create_app, db
from app.models.vendors import Vendor
from app.models.services import Service
from flask import jsonify
import json  # Add this import

app = create_app()

@app.route('/')
def hello():
    return "Welcome to the Wedding Vendor API!"

@app.route('/api/test')
def test():
    return jsonify({
        "message": "API is working!",
        "status": "success",
        "endpoints": [
            "GET /api/vendor/profile/<user_id>",
            "POST /api/vendor/profile",
            "GET /api/vendor/stats/<vendor_id>",
            "GET /api/vendors"  # Added the new endpoint to the list
        ]
    })

# New endpoint to get all vendors with their services
@app.route('/api/vendors', methods=['GET'])
def get_all_vendors():
    try:
        vendors = Vendor.query.all()
        vendors_data = []
        
        for vendor in vendors:
            vendor_data = vendor.to_dict()  # Use your existing to_dict method
            
            # Get vendor services
            services = Service.query.filter_by(vendor_id=vendor.id).all()
            vendor_data['services'] = [{
                'id': service.id,
                'service_name': service.service_name,
                'category': service.category,
                'price': service.price,
                'duration': service.duration,
                'description': service.description,
                'features': json.loads(service.features) if service.features else [],
                'views': service.views,
                'inquiries': service.inquiries,
                'bookings': service.bookings,
                'is_active': service.is_active,
                'created_at': service.created_at.isoformat() if service.created_at else None,
                'updated_at': service.updated_at.isoformat() if service.updated_at else None
            } for service in services]
            
            vendors_data.append(vendor_data)
        
        return jsonify(vendors_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database tables - using application context instead of before_first_request
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Check if tables were created
        result = db.session.execute(db.text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = [row[0] for row in result]
        print(f"📋 Tables in database: {tables}")
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

# Add error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🚀 Starting Flask server...")
    print("📍 Endpoints available at:")
    print("   - http://localhost:5000/api/test")
    print("   - http://localhost:5000/api/vendor/profile/1")
    print("   - http://localhost:5000/api/vendors")  # Added the new endpoint
    
    app.run(debug=True, host='0.0.0.0', port=5000)