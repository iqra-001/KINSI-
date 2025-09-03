from db.KINSI import db
from models.base import BaseModel 

class Service(BaseModel):
    __tablename__ = "services"
    
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey("vendors.id"), nullable=False)
    service_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration = db.Column(db.String(50))
    description = db.Column(db.Text)
    features = db.Column(db.JSON, default=[])  # ✅ generic JSON, works with SQLite & PostgreSQL
    views = db.Column(db.Integer, default=0)
    inquiries = db.Column(db.Integer, default=0)
    bookings = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "vendor_id": self.vendor_id,
            "service_name": self.service_name,
            "category": self.category,
            "price": self.price,
            "duration": self.duration,
            "description": self.description,
            "features": self.features if self.features else [],
            "views": self.views,
            "inquiries": self.inquiries,
            "bookings": self.bookings,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
