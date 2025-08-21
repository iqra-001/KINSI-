from functools import wraps
from flask import request, jsonify
from datetime import datetime, timedelta
import secrets
from collections import defaultdict

_rate_store = defaultdict(list)

def rate_limit(max_requests=5, per_minutes=1):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            client = request.remote_addr or "anon"
            now = datetime.utcnow()
            cutoff = now - timedelta(minutes=per_minutes)
            _rate_store[client] = [t for t in _rate_store[client] if t > cutoff]
            if len(_rate_store[client]) >= max_requests:
                return jsonify({'error': 'Rate limit exceeded'}), 429
            _rate_store[client].append(now)
            return f(*args, **kwargs)
        return wrapper
    return decorator

def generate_csrf_token():
    return secrets.token_urlsafe(32)

def validate_csrf_token(token, stored):
    return secrets.compare_digest(token or "", stored or "")

class SecurityHeaders:
    @staticmethod
    def add_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        response.headers.pop('Server', None)
        return response
