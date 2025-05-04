from datetime import datetime

class Workout:
    def __init__(self, id=None, user_id=None, name=None, calories_burned=None, 
                 duration=None, intensity=None, date=None, created_at=None):
        self.id = id
        self.user_id = user_id
        self.name = name
        self.calories_burned = calories_burned
        self.duration = duration  # in minutes
        self.intensity = intensity or 'medium'  # 'low', 'medium', 'high'
        self.date = date or str(datetime.now().date())
        self.created_at = created_at or datetime.now()

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'name': self.name,
            'calories_burned': self.calories_burned,
            'duration': self.duration,
            'intensity': self.intensity,
            'date': self.date,
            'created_at': self.created_at.isoformat()
        }

    @staticmethod
    def from_dict(data):
        return Workout(
            id=data.get('_id'),
            user_id=data.get('user_id'),
            name=data.get('name'),
            calories_burned=data.get('calories_burned'),
            duration=data.get('duration'),
            intensity=data.get('intensity'),
            date=data.get('date'),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None
        )