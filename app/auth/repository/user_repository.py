# Repository layer for user data access
from app.models.user import User
from app import db

class UserRepository:
    def get_by_username(self, username):
        return User.query.filter_by(username=username).first()

    def create(self, username, email, password):
        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        return user
