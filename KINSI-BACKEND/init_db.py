# init_db.py
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.vendors import Vendor
from app.models.services import Service

def init_database():
    """Initialize the database with all tables"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🗄️  Initializing database...")
            
            # Drop all tables and recreate them
            db.drop_all()
            db.create_all()
            
            print("✅ Database tables created successfully!")
            
            # Check what tables exist
            result = db.session.execute(db.text("SELECT name FROM sqlite_master WHERE type='table';"))
            tables = [row[0] for row in result]
            print(f"📋 Tables in database: {tables}")
            
            # Create a test vendor
            test_vendor = Vendor(
                user_id=1,
                business_name="Test Wedding Vendor",
                owner_name="John Doe",
                email="test@example.com",
                service_type="Photography",
                description="Professional wedding photography services",
                contact_phone="+1234567890",
                address="123 Wedding Street, City"
            )
            db.session.add(test_vendor)
            db.session.commit()
            
            print("✅ Test vendor created successfully!")
            print("🎉 Database initialization complete!")
            
        except Exception as e:
            print(f"❌ Error during database initialization: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
        finally:
            db.session.close()

if __name__ == "__main__":
    init_database()