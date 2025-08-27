from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    """Bind SQLAlchemy and Flask-Migrate to the app"""
    db.init_app(app)
    migrate.init_app(app, db)
