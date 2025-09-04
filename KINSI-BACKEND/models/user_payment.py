# models/user_payment.py
from db.KINSI import db
from datetime import datetime
import uuid

class UserPaymentMethod(db.Model):
    __tablename__ = 'user_payment_methods'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    method_type = db.Column(db.String(20), nullable=False)  # 'card' or 'mpesa'
    card_number = db.Column(db.String(20))  # Store encrypted in production
    card_name = db.Column(db.String(100))
    expiry_date = db.Column(db.String(10))
    mpesa_number = db.Column(db.String(15))
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        # Mask sensitive data
        masked_card = None
        if self.card_number:
            masked_card = f"**** **** **** {self.card_number[-4:]}" if len(self.card_number) > 4 else "****"
            
        return {
            'id': self.id,
            'user_id': self.user_id,
            'method_type': self.method_type,
            'card_number': masked_card,
            'card_name': self.card_name,
            'expiry_date': self.expiry_date,
            'mpesa_number': self.mpesa_number,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }