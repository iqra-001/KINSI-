# init_db.py - Place this file in your project root directory
from app import create_app, db

def init_database():
    """Initialize the database with all tables"""
    app = create_app()
    
    with app.app_context():
        try:
            # Import all models to ensure they're registered
            from app.models.vendors import Vendor
            from app.models.services import Service
            
            # Create all tables
            db.create_all()
            print("✅ Database tables created successfully!")
            
            # Check if tables were created
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Available tables: {tables}")
            
            # Check if we can connect and query
            result = db.session.execute(db.text("SELECT name FROM sqlite_master WHERE type='table';")).fetchall()
            print(f"📋 Tables in database: {[row[0] for row in result]}")
            
            # Test vendor table structure
            vendor_columns = inspector.get_columns('vendors') if 'vendors' in tables else []
            print(f"📋 Vendor table columns: {[col['name'] for col in vendor_columns]}")
            
            # Test service table structure  
            service_columns = inspector.get_columns('services') if 'services' in tables else []
            print(f"📋 Service table columns: {[col['name'] for col in service_columns]}")
            
            print("✅ Database initialization complete!")
            
        except Exception as e:
            print(f"❌ Error during database initialization: {e}")
            db.session.rollback()
        finally:
            db.session.close()

if __name__ == "__main__":
    init_database()