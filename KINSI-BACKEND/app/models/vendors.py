from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
import json

# Import db from the main app file
from app import db

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
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    rating = db.Column(db.Float, default=0.0, nullable=False)
    total_reviews = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationship with services
    services = db.relationship('VendorService', backref='vendor', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Vendor {self.business_name or "Unknown"}>'
    
    def to_dict(self, include_services=False):
        """Convert vendor object to dictionary"""
        data = {
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
            'is_active': self.is_active,
            'rating': self.rating,
            'total_reviews': self.total_reviews,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_services:
            data['services'] = [service.to_dict() for service in self.services]
        
        return data
    
    @classmethod
    def create(cls, user_id, business_name='', service_type='', description='', contact_phone='', 
               address='', owner_name='', email='', experience='', website='', instagram='', 
               facebook='', twitter=''):
        """Create a new vendor"""
        
        # Check if vendor already exists
        existing_vendor = cls.query.filter_by(user_id=user_id).first()
        if existing_vendor:
            raise ValueError(f"Vendor already exists for user_id {user_id}")
        
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
    def update(cls, user_id, **kwargs):
        """Update vendor profile"""
        vendor = cls.query.filter_by(user_id=user_id).first()
        if not vendor:
            return False
        
        try:
            # Update only provided fields
            update_fields = [
                'business_name', 'service_type', 'description', 'contact_phone',
                'address', 'owner_name', 'email', 'experience', 'website',
                'instagram', 'facebook', 'twitter'
            ]
            
            for field in update_fields:
                if field in kwargs:
                    setattr(vendor, field, kwargs[field])
            
            vendor.updated_at = datetime.utcnow()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error updating vendor: {str(e)}")
    
    @classmethod
    def get_all(cls, active_only=True):
        """Get all vendors"""
        query = cls.query
        if active_only:
            query = query.filter_by(is_active=True)
        
        vendors = query.order_by(cls.created_at.desc()).all()
        return [vendor.to_dict() for vendor in vendors]
    
    @classmethod
    def delete(cls, user_id):
        """Soft delete vendor by user_id"""
        vendor = cls.query.filter_by(user_id=user_id).first()
        if not vendor:
            return False
        
        try:
            vendor.is_active = False
            vendor.updated_at = datetime.utcnow()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error deleting vendor: {str(e)}")
    
    @classmethod
    def search(cls, category=None, location=None, min_rating=None):
        """Search vendors with filters"""
        query = cls.query.filter_by(is_active=True)
        
        if category:
            query = query.filter(cls.service_type == category)
        if location:
            query = query.filter(cls.address.like(f'%{location}%'))
        if min_rating is not None:
            query = query.filter(cls.rating >= min_rating)
        
        vendors = query.order_by(cls.rating.desc(), cls.created_at.desc()).all()
        return [vendor.to_dict() for vendor in vendors]


class VendorService(db.Model):
    __tablename__ = 'vendor_services'
    
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False, index=True)
    service_name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='KSH', nullable=False)
    duration = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    features = db.Column(db.Text, nullable=True)  # JSON string
    status = db.Column(db.String(20), default='active', nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    views = db.Column(db.Integer, default=0, nullable=False)
    inquiries = db.Column(db.Integer, default=0, nullable=False)
    bookings = db.Column(db.Integer, default=0, nullable=False)
    rating = db.Column(db.Float, default=0.0, nullable=False)
    total_reviews = db.Column(db.Integer, default=0, nullable=False)
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
            self.features = json.dumps(value) if isinstance(value, list) else value
        else:
            self.features = json.dumps([])
    
    def to_dict(self, include_vendor=False):
        """Convert service object to dictionary"""
        data = {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'service_name': self.service_name,
            'category': self.category,
            'price': self.price,
            'currency': self.currency,
            'duration': self.duration,
            'description': self.description,
            'features': self.features_list,
            'status': self.status,
            'is_featured': self.is_featured,
            'views': self.views,
            'inquiries': self.inquiries,
            'bookings': self.bookings,
            'rating': self.rating,
            'total_reviews': self.total_reviews,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_vendor and self.vendor:
            data['vendor'] = {
                'business_name': self.vendor.business_name,
                'contact_phone': self.vendor.contact_phone,
                'address': self.vendor.address,
                'rating': self.vendor.rating
            }
        
        return data
    
    @classmethod
    def create(cls, vendor_id, service_name, category, price, duration='', 
               description='', features=None, currency='KSH'):
        """Create a new service"""
        
        # Validate vendor exists
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            raise ValueError(f"Vendor with id {vendor_id} does not exist")
        
        if features is None:
            features = []
        
        service = cls(
            vendor_id=vendor_id,
            service_name=service_name,
            category=category,
            price=price,
            duration=duration,
            description=description,
            currency=currency
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
    def get_by_vendor_id(cls, vendor_id, active_only=True):
        """Get services by vendor_id"""
        query = cls.query.filter_by(vendor_id=vendor_id)
        if active_only:
            query = query.filter_by(status='active')
        
        services = query.order_by(cls.created_at.desc()).all()
        return [service.to_dict() for service in services]
    
    @classmethod
    def get_by_id(cls, service_id):
        """Get service by id"""
        service = cls.query.get(service_id)
        return service.to_dict(include_vendor=True) if service else None
    
    @classmethod
    def update(cls, service_id, **kwargs):
        """Update service"""
        service = cls.query.get(service_id)
        if not service:
            return False
        
        try:
            # Update only provided fields
            update_fields = [
                'service_name', 'category', 'price', 'duration', 
                'description', 'currency', 'status', 'is_featured'
            ]
            
            for field in update_fields:
                if field in kwargs:
                    setattr(service, field, kwargs[field])
            
            # Handle features specially
            if 'features' in kwargs:
                service.features_list = kwargs['features']
            
            service.updated_at = datetime.utcnow()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error updating service: {str(e)}")
    
    @classmethod
    def delete(cls, service_id):
        """Soft delete service"""
        service = cls.query.get(service_id)
        if not service:
            return False
        
        try:
            service.status = 'deleted'
            service.updated_at = datetime.utcnow()
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error deleting service: {str(e)}")
    
    @classmethod
    def get_vendor_stats(cls, vendor_id):
        """Get vendor statistics"""
        try:
            services = cls.query.filter_by(vendor_id=vendor_id, status='active').all()
            
            total_services = len(services)
            total_views = sum(service.views for service in services)
            total_inquiries = sum(service.inquiries for service in services)
            total_bookings = sum(service.bookings for service in services)
            average_rating = sum(service.rating for service in services) / total_services if total_services > 0 else 0
            
            return {
                'total_services': total_services,
                'total_views': total_views,
                'total_inquiries': total_inquiries,
                'total_bookings': total_bookings,
                'average_rating': round(average_rating, 2)
            }
        except Exception as e:
            raise Exception(f"Error fetching stats: {str(e)}")
    
    @classmethod
    def get_all(cls, limit=None, offset=None):
        """Get all active services across all vendors"""
        query = db.session.query(cls, Vendor.business_name, Vendor.contact_phone, Vendor.address)\
            .join(Vendor, cls.vendor_id == Vendor.id)\
            .filter(cls.status == 'active', Vendor.is_active == True)\
            .order_by(cls.is_featured.desc(), cls.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        if offset:
            query = query.offset(offset)
        
        services = query.all()
        
        services_list = []
        for service, business_name, contact_phone, address in services:
            service_dict = service.to_dict()
            service_dict['business_name'] = business_name
            service_dict['contact_phone'] = contact_phone
            service_dict['address'] = address
            services_list.append(service_dict)
        
        return services_list
    
    @classmethod
    def search_services(cls, category=None, min_price=None, max_price=None, 
                       location=None, min_rating=None, limit=None, offset=None):
        """Search services with filters"""
        query = db.session.query(cls, Vendor.business_name, Vendor.contact_phone, Vendor.address)\
            .join(Vendor, cls.vendor_id == Vendor.id)\
            .filter(cls.status == 'active', Vendor.is_active == True)
        
        if category:
            query = query.filter(cls.category == category)
        if min_price is not None:
            query = query.filter(cls.price >= min_price)
        if max_price is not None:
            query = query.filter(cls.price <= max_price)
        if location:
            query = query.filter(Vendor.address.like(f'%{location}%'))
        if min_rating is not None:
            query = query.filter(cls.rating >= min_rating)
        
        query = query.order_by(cls.is_featured.desc(), cls.rating.desc(), cls.created_at.desc())
        
        if limit:
            query = query.limit(limit)
        if offset:
            query = query.offset(offset)
        
        services = query.all()
        
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
    
    @classmethod
    def get_categories(cls):
        """Get all unique service categories"""
        try:
            categories = db.session.query(cls.category.distinct()).filter(cls.status == 'active').all()
            return [category[0] for category in categories if category[0]]
        except Exception as e:
            raise Exception(f"Error fetching categories: {str(e)}")
    
    @classmethod
    def get_featured_services(cls, limit=10):
        """Get featured services"""
        try:
            services = cls.query.filter_by(status='active', is_featured=True)\
                .order_by(cls.rating.desc(), cls.created_at.desc())\
                .limit(limit).all()
            return [service.to_dict(include_vendor=True) for service in services]
        except Exception as e:
            raise Exception(f"Error fetching featured services: {str(e)}")