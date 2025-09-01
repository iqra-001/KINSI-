# app.py - Improved version with better error handling
from app import create_app, db
import os
from flask import jsonify

app = create_app()

# Add error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({"error": "Internal server error"}), 500

# Add a test endpoint
@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({
        "message": "Server is running!",
        "status": "success",
        "endpoints": [
            "GET /api/test",
            "GET /api/vendor/profile/<user_id>",
            "POST /api/vendor/profile",
            "GET /api/vendor/services/<vendor_id>",
            "POST /api/vendor/services",
            "GET /api/vendor/stats/<vendor_id>"
        ]
    }), 200

# Add request logging for debugging
@app.before_request
def log_request_info():
    from flask import request
    print(f"\n=== Incoming Request ===")
    print(f"Method: {request.method}")
    print(f"URL: {request.url}")
    print(f"Headers: {dict(request.headers)}")
    if request.is_json:
        print(f"JSON Data: {request.get_json()}")
    print(f"========================\n")

@app.after_request
def log_response_info(response):
    print(f"\n=== Outgoing Response ===")
    print(f"Status: {response.status}")
    print(f"Headers: {dict(response.headers)}")
    print(f"=========================\n")
    return response

if __name__ == '__main__':
    # Initialize database tables on startup
    with app.app_context():
        try:
            db.create_all()
            print("✅ Database tables created/verified successfully!")
        except Exception as e:
            print(f"❌ Database error: {e}")
    
    print("🚀 Starting Flask server...")
    print("📍 Server will be available at:")
    print("   - http://localhost:5000")
    print("   - http://127.0.0.1:5000")
    print("🧪 Test endpoint: http://localhost:5000/api/test")
    print("👤 Vendor API: http://localhost:5000/api/vendor/profile/1")
    
    # Start server with detailed configuration
    app.run(
        debug=True, 
        port=5000, 
        host='0.0.0.0',  # Accept connections from any IP
        threaded=True,   # Handle multiple requests
        use_reloader=True  # Auto-reload on code changes
    )