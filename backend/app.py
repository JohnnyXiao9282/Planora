from env_loader import load_env

load_env()  # load backend/.env before anything reads env vars

from flask import Flask

from controller.resume_template_controller import resume_template_bp
from controller.cart_controller import cart_bp
from controller.checkout_controller import checkout_bp
from controller.agent_controller import agent_bp
from controller.profile_controller import profile_bp


app = Flask(__name__)
app.secret_key = 'dev_secret_key_please_change'  # Needed for session support


# Register blueprints
app.register_blueprint(resume_template_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(checkout_bp)
app.register_blueprint(agent_bp)
app.register_blueprint(profile_bp)

if __name__ == "__main__":
    app.run(debug=True)
