from datetime import datetime
import bcrypt

class User:
    def __init__(self, id=None, name=None, email=None, password_hash=None, age=None, 
                 gender=None, height=None, weight=None, fitness_goal=None, created_at=None):
        self.id = id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.age = age
        self.gender = gender
        self.height = height  # in cm
        self.weight = weight  # in kg
        self.fitness_goal = fitness_goal  # 'loss', 'maintain', 'gain'
        self.created_at = created_at or datetime.now()

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'gender': self.gender,
            'height': self.height,
            'weight': self.weight,
            'fitness_goal': self.fitness_goal,
            'created_at': self.created_at.isoformat()
        }

    @staticmethod
    def from_dict(data):
        return User(
            id=data.get('_id'),
            name=data.get('name'),
            email=data.get('email'),
            password_hash=data.get('password_hash'),
            age=data.get('age'),
            gender=data.get('gender'),
            height=data.get('height'),
            weight=data.get('weight'),
            fitness_goal=data.get('fitness_goal'),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None
        )