from db.KINSI import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from models.base import BaseModel   # import the shared mixin

class User(BaseModel):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default="user")

    # Relationships
    vendor = db.relationship("Vendor", backref="user", uselist=False, cascade="all, delete-orphan")

    # Password methods
    def set_password(self, password):
        """Hashes the password and stores it."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Checks a plain password against the stored hash."""
        return check_password_hash(self.password_hash, password)

    def is_vendor(self):
        return self.role.lower() == 'vendor'

    def is_user(self):
        return self.role.lower() == 'user'

    # Serialization
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
