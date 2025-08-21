import os
from app import create_app, db
from app.models import User, UserActivity
from config import Config

base_dir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(base_dir, 'kinsi.db')
os.environ['DATABASE_URL'] = f'sqlite:///{db_path}'

app = create_app(os.getenv('FLASK_CONFIG') or 'default')

# Print DB path at startup for debugging
print(f"🔍 Using database at: {app.config['SQLALCHEMY_DATABASE_URI']}")

@app.shell_context_processor
def shell_ctx():
    return {'db': db, 'User': User, 'UserActivity': UserActivity}

@app.cli.command('init-db')
def init_db():
    db.create_all()
    print('✅ Database initialized.')

@app.cli.command('create-admin')
def create_admin():
    username = input('Admin username: ')
    email = input('Admin email: ')
    password = input('Admin password: ')
    if User.query.filter_by(username=username).first():
        print('❌ Username already exists'); return
    if User.query.filter_by(email=email).first():
        print('❌ Email already exists'); return
    u = User(username=username, email=email, role='admin')
    u.set_password(password)
    db.session.add(u); db.session.commit()
    print('✅ Admin created.')

if __name__ == "__main__":
    with app.app_context():
        # Only create tables if the database file doesn't exist
        if not os.path.exists(db_path):
            print(f"🔄 Database file doesn't exist, creating at: {db_path}")
            db.create_all()
        else:
            print(f"✅ Using existing database at: {db_path}")
    
    print("🚀 Starting Flask application...")
    app.run(host="0.0.0.0", port=5000, debug=True)