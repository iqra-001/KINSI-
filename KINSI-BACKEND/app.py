from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import db setup
from db.KINSI import db, init_db

# ========== EXTENSIONS ==========
migrate = Migrate()
jwt = JWTManager()
api = Api()

app = Flask(__name__)

# ========== CONFIG ==========
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES"))
app.config['CORS_HEADERS'] = 'Content-Type'

# ========== INIT EXTENSIONS ==========
db.init_app(app)
migrate.init_app(app, db, directory="db/migrations")
jwt.init_app(app)
api.init_app(app)

# ✅ Allow React frontend to talk with backend
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

# ========== IMPORT MODELS ==========
from models import *
# from models import User, Service, Vendor, TokenBlocklist
# from models.user_profile import UserProfile
# from models.user_event import UserEvent
# from models.user_payment import UserPaymentMethod

# ========== JWT BLOCKLIST ==========
from models.tokenblocklist import TokenBlocklist

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload.get("jti")
    return db.session.query(TokenBlocklist.id).filter_by(jti=jti).first() is not None

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Token has been revoked. Please log in again."}), 401

# ========== REGISTER BLUEPRINTS ==========
# try:
#     from routes.user_dashboard import user_dashboard_bp
#     app.register_blueprint(
#         user_dashboard_bp,
#         url_prefix='/api/user-dashboard',
#         name='user_dashboard_api'
#     )
# except ImportError:
#     print("⚠️ User dashboard routes not available yet")

# Import all routes list
from routes import all_routes
for bp in all_routes:
    app.register_blueprint(bp, url_prefix='/api')

# ========== RUN ==========
if __name__ == "__main__":
    app.run(port=5555, debug=True)
