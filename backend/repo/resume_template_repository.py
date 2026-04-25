# Repository for ResumeTemplate model
from model.resume_template import ResumeTemplate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def get_all():
    return ResumeTemplate.query.all()

def get_by_id(template_id):
    return ResumeTemplate.query.get(template_id)

def create(data):
    template = ResumeTemplate(**data)
    db.session.add(template)
    db.session.commit()
    return template

def update(template_id, data):
    template = ResumeTemplate.query.get(template_id)
    if not template:
        return None
    for key, value in data.items():
        setattr(template, key, value)
    db.session.commit()
    return template

def delete(template_id):
    template = ResumeTemplate.query.get(template_id)
    if not template:
        return False
    db.session.delete(template)
    db.session.commit()
    return True
