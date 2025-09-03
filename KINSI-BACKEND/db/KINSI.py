from flask_sqlalchemy import SQLAlchemy

# It create an instance of SQLAlchemy for model definitions
db = SQLAlchemy()

def init_db(app):
    
    # Initialize the SQLAlchemy instance with the Flask app and create all tables.
    db.init_app(app)
    with app.app_context():
        db.create_all()
