from db.KINSI import db
from models.base import BaseModel   # import the shared mixin

class Vendor(BaseModel):
    __tablename__ = "vendors"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    business_name = db.Column(db.String(100), nullable=False)
    owner_name = db.Column(db.String(100))
    business_email = db.Column(db.String(120))
    service_type = db.Column(db.String(100))
    description = db.Column(db.Text)
    contact_phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    experience = db.Column(db.String(100))
    website = db.Column(db.String(120))
    instagram = db.Column(db.String(120))
    facebook = db.Column(db.String(120))
    twitter = db.Column(db.String(120))
    rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)

    # Relationships
    services = db.relationship("Service", backref="vendor", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "business_name": self.business_name,
            "owner_name": self.owner_name,
            "business_email": self.business_email,
            "service_type": self.service_type,
            "description": self.description,
            "contact_phone": self.contact_phone,
            "address": self.address,
            "experience": self.experience,
            "website": self.website,
            "instagram": self.instagram,
            "facebook": self.facebook,
            "twitter": self.twitter,
            "rating": self.rating,
            "total_reviews": self.total_reviews,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
