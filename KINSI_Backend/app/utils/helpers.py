from flask import request

def get_client_ip():
    hdrs = ['HTTP_X_FORWARDED_FOR', 'X-Forwarded-For', 'X-Real-IP']
    for h in hdrs:
        if request.headers.get(h):
            return request.headers.get(h).split(',')[0].strip()
    return request.remote_addr
