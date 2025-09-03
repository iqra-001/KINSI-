from db.KINSI import db
from datetime import datetime
from models.base import BaseModel 

class TokenBlocklist(BaseModel): 
    __tablename__ = 'token_blocklist'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id')) 

    user = db.relationship('User', backref='revoked_tokens', lazy=True)

    def __repr__(self):
        return f"<TokenBlocklist jti={self.jti}>"

    def to_dict(self):
        data = super().to_dict()
        data.update({
            "jti": self.jti,
            "user_id": self.user_id,
            "username": self.user.username if self.user else None
        })
        return data
