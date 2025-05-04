from models.user import User
from datetime import datetime

class AuthService:
    def __init__(self):
        # In a real app, this would be your database connection
        self.users = []
        
    def register_user(self, name, email, password, age, gender, height, weight, fitness_goal):
        if self.get_user_by_email(email):
            raise Exception('Email already registered')
        
        user = User(
            name=name,
            email=email,
            age=age,
            gender=gender,
            height=height,
            weight=weight,
            fitness_goal=fitness_goal
        )
        user.set_password(password)
        
        # Save to database in real app
        user.id = len(self.users) + 1  # Simulate auto-increment ID
        self.users.append(user)
        return user
    
    def login_user(self, email, password):
        user = self.get_user_by_email(email)
        if not user or not user.check_password(password):
            raise Exception('Invalid email or password')
        return user
    
    def get_user_by_email(self, email):
        for user in self.users:
            if user.email == email:
                return user
        return None
    
    def get_user_by_id(self, user_id):
        for user in self.users:
            if str(user.id) == str(user_id):
                return user
        return None
    
    def update_user(self, user_id, name, age, gender, height, weight, fitness_goal):
        user = self.get_user_by_id(user_id)
        if not user:
            raise Exception('User not found')
        
        if name: user.name = name
        if age: user.age = age
        if gender: user.gender = gender
        if height: user.height = height
        if weight: user.weight = weight
        if fitness_goal: user.fitness_goal = fitness_goal
        
        return user