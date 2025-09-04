# models/__init__.py
from db.KINSI import db

from .user import User
from .services import Service
from .vendors import Vendor
from .tokenblocklist import TokenBlocklist
from .base import BaseModel

# Import the new dashboard models
from .user_profile import UserProfile
from .user_event import UserEvent
from .user_payment import UserPaymentMethod

__all__ = [
    "db",
    "User",
    "Service",
    "Vendor",
    "TokenBlocklist",
    "BaseModel",
    "UserProfile",
    "UserEvent",
    "UserPaymentMethod"
]