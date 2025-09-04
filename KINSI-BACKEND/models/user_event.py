# models/user_event.py
from db.KINSI import db
from datetime import datetime
import uuid

class UserEvent(db.Model):
    __tablename__ = 'user_events'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    event_name = db.Column(db.String(100), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_name': self.event_name,
            'event_type': self.event_type,
            'date': self.date.isoformat(),
            'budget': self.budget,
            'guests': self.guests,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }