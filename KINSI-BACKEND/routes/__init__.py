# routes/__init__.py
from .auth_routes import auth_bp
from .user_routes import user_bp
from .service_routes import service_bp
from .vendor_routes import vendor_bp

# Import the new dashboard routes
from .user_dashboard import user_dashboard_bp

all_routes = [
    auth_bp,
    user_bp,
    service_bp,
    vendor_bp,
    user_dashboard_bp,  # Add the new dashboard blueprint
]