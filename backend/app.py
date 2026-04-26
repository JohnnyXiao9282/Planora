from flask import Flask
from controller.resume_template_controller import resume_template_bp

app = Flask(__name__)

# Register blueprints
app.register_blueprint(resume_template_bp)

if __name__ == "__main__":
    app.run(debug=True)
