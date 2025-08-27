from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
import json

# Import db from your main app file
# You'll need to make this import work based on your project structure
try:
    from app import db
except ImportError:
    # If circular import, create a new db instance
    db = SQLAlchemy()

class Vendor(db.Model):
    __tablename__ = 'vendors'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False, index=True)
    business_name = db.Column(db.String(255), nullable=True)
    owner_name = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=True)
    service_type = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    contact_phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    experience = db.Column(db.String(50), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    instagram = db.Column(db.String(255), nullable=True)
    facebook = db.Column(db.String(255), nullable=True)
    twitter = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationship with services
    services = db.relationship('VendorService', backref='vendor', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Vendor {self.business_name}>'
    
    def to_dict(self):
        """Convert vendor object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'business_name': self.business_name,
            'owner_name': self.owner_name,
            'email': self.email,
            'service_type': self.service_type,
            'description': self.description,
            'contact_phone': self.contact_phone,
            'address': self.address,
            'experience': self.experience,
            'website': self.website,
            'instagram': self.instagram,
            'facebook': self.facebook,
            'twitter': self.twitter,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def create(cls, user_id, business_name, service_type, description, contact_phone, address,
               owner_name='', email='', experience='', website='', instagram='', facebook='', twitter=''):
        """Create a new vendor"""
        vendor = cls(
            user_id=user_id,
            business_name=business_name,
            service_type=service_type,
            description=description,
            contact_phone=contact_phone,
            address=address,
            owner_name=owner_name,
            email=email,
            experience=experience,
            website=website,
            instagram=instagram,
            facebook=facebook,
            twitter=twitter
        )
        
        try:
            db.session.add(vendor)
            db.session.commit()
            return vendor.id
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error creating vendor: {str(e)}")
    
    @classmethod
    def get_by_user_id(cls, user_id):
        """Get vendor by user_id"""
        vendor = cls.query.filter_by(user_id=user_id).first()
        return vendor.to_dict() if vendor else None
    
    @classmethod
    def get_by_id(cls, vendor_id):
        """Get vendor by id"""
        vendor = cls.query.get(vendor_id)
        return vendor.to_dict() if vendor else None
    
    @classmethod
    def update(cls, user_id, business_name, service_type, description, contact_phone, address,
               owner_name='', email='', experience='', website='', instagram='', facebook='', twitter=''):
        """Update vendor profile"""
        vendor = cls.query.filter_by(user_id=user_id).first()
        if not vendor:
            return False
        
        try:
            vendor.business_name = business_name
            vendor.service_type = service_type
            vendor.description = description
            vendor.contact_phone = contact_phone
            vendor.address = address
            vendor.owner_name = owner_name
            vendor.email = email
            vendor.experience = experience
            vendor.website = website
            vendor.instagram = instagram
            vendor.facebook = facebook
            vendor.twitter = twitter
            vendor.updated_at = datetime.utcnow()
            
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error updating vendor: {str(e)}")
    
    @classmethod
    def get_all(cls):
        """Get all vendors"""
        vendors = cls.query.order_by(cls.created_at.desc()).all()
        return [vendor.to_dict() for vendor in vendors]
    
    @classmethod
    def delete(cls, user_id):
        """Delete vendor by user_id"""
        vendor = cls.query.filter_by(user_id=user_id).first()
        if not vendor:
            return False
        
        try:
            db.session.delete(vendor)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error deleting vendor: {str(e)}")


class VendorService(db.Model):
    __tablename__ = 'vendor_services'
    
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False, index=True)
    service_name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    features = db.Column(db.Text, nullable=True)  # JSON string
    status = db.Column(db.String(20), default='active', nullable=False)
    views = db.Column(db.Integer, default=0, nullable=False)
    inquiries = db.Column(db.Integer, default=0, nullable=False)
    bookings = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<VendorService {self.service_name}>'
    
    @hybrid_property
    def features_list(self):
        """Get features as a list"""
        if self.features:
            try:
                return json.loads(self.features)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    @features_list.setter
    def features_list(self, value):
        """Set features from a list"""
        if value:
            self.features = json.dumps(value)
        else:
            self.features = json.dumps([])
    
    def to_dict(self):
        """Convert service object to dictionary"""
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'service_name': self.service_name,
            'category': self.category,
            'price': self.price,
            'duration': self.duration,
            'description': self.description,
            'features': self.features_list,
            'status': self.status,
            'views': self.views,
            'inquiries': self.inquiries,
            'bookings': self.bookings,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def create(cls, vendor_id, service_name, category, price, duration='', description='', features=None):
        """Create a new service"""
        if features is None:
            features = []
        
        service = cls(
            vendor_id=vendor_id,
            service_name=service_name,
            category=category,
            price=price,
            duration=duration,
            description=description
        )
        service.features_list = features
        
        try:
            db.session.add(service)
            db.session.commit()
            return service.id
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error creating service: {str(e)}")
    
    @classmethod
    def get_by_vendor_id(cls, vendor_id):
        """Get services by vendor_id"""
        services = cls.query.filter_by(vendor_id=vendor_id).order_by(cls.created_at.desc()).all()
        return [service.to_dict() for service in services]
    
    @classmethod
    def get_by_id(cls, service_id):
        """Get service by id"""
        service = cls.query.get(service_id)
        return service.to_dict() if service else None
    
    @classmethod
    def update(cls, service_id, service_name=None, category=None, price=None, duration=None, description=None, features=None):
        """Update service"""
        service = cls.query.get(service_id)
        if not service:
            return False
        
        try:
            if service_name is not None:
                service.service_name = service_name
            if category is not None:
                service.category = category
            if price is not None:
                service.price = price
            if duration is not None:
                service.duration = duration
            if description is not None:
                service.description = description
            if features is not None:
                service.features_list = features
            
            service.updated_at = datetime.utcnow()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error updating service: {str(e)}")
    
    @classmethod
    def delete(cls, service_id):
        """Delete service"""
        service = cls.query.get(service_id)
        if not service:
            return False
        
        try:
            db.session.delete(service)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error deleting service: {str(e)}")
    
    @classmethod
    def get_vendor_stats(cls, vendor_id):
        """Get vendor statistics"""
        try:
            services = cls.query.filter_by(vendor_id=vendor_id).all()
            
            total_services = len(services)
            total_views = sum(service.views for service in services)
            total_inquiries = sum(service.inquiries for service in services)
            total_bookings = sum(service.bookings for service in services)
            
            return {
                'total_services': total_services,
                'total_views': total_views,
                'total_inquiries': total_inquiries,
                'total_bookings': total_bookings
            }
        except Exception as e:
            raise Exception(f"Error fetching stats: {str(e)}")
    
    @classmethod
    def get_all(cls):
        """Get all services across all vendors"""
        services = db.session.query(cls, Vendor.business_name, Vendor.contact_phone)\
            .join(Vendor, cls.vendor_id == Vendor.id)\
            .filter(cls.status == 'active')\
            .order_by(cls.created_at.desc()).all()
        
        services_list = []
        for service, business_name, contact_phone in services:
            service_dict = service.to_dict()
            service_dict['business_name'] = business_name
            service_dict['contact_phone'] = contact_phone
            services_list.append(service_dict)
        
        return services_list
    
    @classmethod
    def search_services(cls, category=None, min_price=None, max_price=None, location=None):
        """Search services with filters"""
        query = db.session.query(cls, Vendor.business_name, Vendor.contact_phone, Vendor.address)\
            .join(Vendor, cls.vendor_id == Vendor.id)\
            .filter(cls.status == 'active')
        
        if category:
            query = query.filter(cls.category == category)
        if min_price is not None:
            query = query.filter(cls.price >= min_price)
        if max_price is not None:
            query = query.filter(cls.price <= max_price)
        if location:
            query = query.filter(Vendor.address.like(f'%{location}%'))
        
        services = query.order_by(cls.created_at.desc()).all()
        
        services_list = []
        for service, business_name, contact_phone, address in services:
            service_dict = service.to_dict()
            service_dict['business_name'] = business_name
            service_dict['contact_phone'] = contact_phone
            service_dict['address'] = address
            services_list.append(service_dict)
        
        return services_list
    
    @classmethod
    def increment_views(cls, service_id):
        """Increment view count for a service"""
        service = cls.query.get(service_id)
        if service:
            try:
                service.views += 1
                db.session.commit()
                return True
            except Exception as e:
                db.session.rollback()
                raise Exception(f"Error incrementing views: {str(e)}")
        return False
    
    @classmethod
    def increment_inquiries(cls, service_id):
        """Increment inquiry count for a service"""
        service = cls.query.get(service_id)
        if service:
            try:
                service.inquiries += 1
                db.session.commit()
                return True
            except Exception as e:
                db.session.rollback()
                raise Exception(f"Error incrementing inquiries: {str(e)}")
        return False
    
    @classmethod
    def increment_bookings(cls, service_id):
        """Increment booking count for a service"""
        service = cls.query.get(service_id)
        if service:
            try:
                service.bookings += 1
                db.session.commit()
                return True
            except Exception as e:
                db.session.rollback()
                raise Exception(f"Error incrementing bookings: {str(e)}")
        return False