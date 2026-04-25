from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ResumeTemplate(db.Model):
    __tablename__ = 'resume_templates'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    preview_image = db.Column(db.String(255), nullable=True)
