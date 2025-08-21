import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

def get_safe_db_path():
    """Get a safe, writable database path for Windows"""
    
    # Option 1: Try user's AppData/Local
    try:
        appdata_dir = os.path.join(os.path.expanduser("~"), "AppData", "Local", "KINSI")
        os.makedirs(appdata_dir, exist_ok=True)
        
        # Test write permissions
        test_file = os.path.join(appdata_dir, "test.tmp")
        with open(test_file, 'w') as f:
            f.write('test')
        os.remove(test_file)
        
        return os.path.join(appdata_dir, "kinsi.db")
    except Exception as e:
        print(f"AppData not accessible: {e}")
    
    # Option 2: Try project directory
    try:
        instance_dir = os.path.join(BASE_DIR, "instance")
        os.makedirs(instance_dir, exist_ok=True)
        
        # Test write permissions
        test_file = os.path.join(instance_dir, "test.tmp")
        with open(test_file, 'w') as f:
            f.write('test')
        os.remove(test_file)
        
        return os.path.join(instance_dir, "kinsi.db")
    except Exception as e:
        print(f"Instance directory not accessible: {e}")
    
    # Option 3: Try temp directory
    try:
        import tempfile
        temp_dir = os.path.join(tempfile.gettempdir(), "KINSI")
        os.makedirs(temp_dir, exist_ok=True)
        return os.path.join(temp_dir, "kinsi.db")
    except Exception as e:
        print(f"Temp directory not accessible: {e}")
    
    # Option 4: Fallback to current directory
    return os.path.join(BASE_DIR, "kinsi.db")

# Get the safe database path
DB_PATH = get_safe_db_path()
print(f"🔍 Selected database path: {DB_PATH}")

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev_secret_key_change_me"

    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or f"sqlite:///{DB_PATH}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = os.environ.get("SESSION_COOKIE_SAMESITE", "Lax")
    SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "False").lower() in ("1", "true", "yes")
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600

    FRONTEND_ORIGINS = os.environ.get(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,https://*.github.dev"
    ).split(",")

    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = int(os.environ.get("MAIL_PORT") or 587)
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "true").lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_timeout': 20,
        'max_overflow': 0,
    }


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig,
}