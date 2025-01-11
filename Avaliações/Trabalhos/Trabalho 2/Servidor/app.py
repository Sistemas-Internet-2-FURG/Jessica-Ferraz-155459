from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config
from models import db
from routes import routes_bp

app = Flask(__name__)
app.config.from_object(Config)
jwt = JWTManager(app)
CORS(app)
migrate = Migrate(app, db)
db.init_app(app)

# Registra as rotas do blueprint
app.register_blueprint(routes_bp)

if __name__ == "__main__":
    app.run(debug=True)
