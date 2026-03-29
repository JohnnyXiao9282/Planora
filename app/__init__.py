from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os

db = SQLAlchemy()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')

    db.init_app(app)
    login_manager.init_app(app)

    from .auth import auth as auth_blueprint
    from .products import products as products_blueprint
    from .cart import cart as cart_blueprint
        # from .orders import orders as orders_blueprint

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(products_blueprint)
    app.register_blueprint(cart_blueprint)
        # app.register_blueprint(orders_blueprint)

    return app
