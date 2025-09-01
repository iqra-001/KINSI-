from app import db
from datetime import datetime

class Service(db.Model):
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    service_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration = db.Column(db.String(50))
    description = db.Column(db.Text)
    features = db.Column(db.Text)  # JSON string of features
    views = db.Column(db.Integer, default=0)
    inquiries = db.Column(db.Integer, default=0)
    bookings = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        import json
        return {
            "id": self.id,
            "vendor_id": self.vendor_id,
            "service_name": self.service_name,
            "category": self.category,
            "price": self.price,
            "duration": self.duration,
            "description": self.description,
            "features": json.loads(self.features) if self.features else [],
            "views": self.views,
            "inquiries": self.inquiries,
            "bookings": self.bookings,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }