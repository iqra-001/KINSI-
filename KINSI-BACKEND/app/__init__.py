# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from app.config import Config

db = SQLAlchemy()
migrate = Migrate() 

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Enable CORS with proper configuration
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Import models so Alembic can see them
   
    
    # Register blueprints
    from app.routes.vendor_routes import vendor_bp
    from app.routes.service_routes import service_bp
   

    app.register_blueprint(vendor_bp, url_prefix='/api')
    app.register_blueprint(service_bp, url_prefix='/api')
    
    return app
