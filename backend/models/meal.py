from datetime import datetime

class Meal:
    def __init__(self, id=None, user_id=None, name=None, calories=None, protein=None, 
                 carbs=None, fats=None, time=None, date=None, created_at=None):
        self.id = id
        self.user_id = user_id
        self.name = name
        self.calories = calories
        self.protein = protein
        self.carbs = carbs
        self.fats = fats
        self.time = time or datetime.now().strftime('%H:%M')
        self.date = date or str(datetime.now().date())
        self.created_at = created_at or datetime.now()

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'name': self.name,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fats': self.fats,
            'time': self.time,
            'date': self.date,
            'created_at': self.created_at.isoformat()
        }

    @staticmethod
    def from_dict(data):
        return Meal(
            id=data.get('_id'),
            user_id=data.get('user_id'),
            name=data.get('name'),
            calories=data.get('calories'),
            protein=data.get('protein'),
            carbs=data.get('carbs'),
            fats=data.get('fats'),
            time=data.get('time'),
            date=data.get('date'),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None
        )