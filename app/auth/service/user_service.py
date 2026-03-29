# Service layer for authentication-related business logic
class UserService:
    def __init__(self, user_repo):
        self.user_repo = user_repo

    def authenticate(self, username, password):
        user = self.user_repo.get_by_username(username)
        if user and user.password == password:  # Replace with hashed check
            return user
        return None

    def create_user(self, username, email, password):
        return self.user_repo.create(username, email, password)
