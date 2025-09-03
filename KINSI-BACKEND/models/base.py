from db.KINSI import db
from datetime import datetime

class BaseModel(db.Model):
    __abstract__ = True  # prevents creating a table for this class

    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
