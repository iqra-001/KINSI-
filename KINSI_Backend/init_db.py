import os

# Set the database path BEFORE importing anything
base_dir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(base_dir, 'kinsi.db')

# Set environment variable to override config
os.environ['DATABASE_URL'] = f'sqlite:///{db_path}'

print(f"🚀 Initializing database at: {db_path}")

# Now import your app
from app import create_app, db

app = create_app()

with app.app_context():
    try:
        # Create all tables
        db.create_all()
        print("✅ Database created successfully!")
        print(f"📍 Database location: {db_path}")
        
        # Verify the database file exists and has content
        if os.path.exists(db_path):
            file_size = os.path.getsize(db_path)
            print(f"📦 Database file size: {file_size} bytes")
            
            # List tables to confirm creation
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Created tables: {tables}")
            
        else:
            print("❌ Database file was not created")
            
    except Exception as e:
        print(f"❌ Database creation failed: {e}")
        import traceback
        traceback.print_exc()