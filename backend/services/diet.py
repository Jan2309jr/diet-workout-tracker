from models.meal import Meal
from datetime import datetime

class DietService:
    def __init__(self):
        # In a real app, this would be your database connection
        self.meals = []
        
    def add_meal(self, user_id, name, calories, protein, carbs, fats, time, date):
        meal = Meal(
            user_id=user_id,
            name=name,
            calories=calories,
            protein=protein,
            carbs=carbs,
            fats=fats,
            time=time,
            date=date
        )
        
        # Save to database in real app
        meal.id = len(self.meals) + 1  # Simulate auto-increment ID
        self.meals.append(meal)
        return meal
    
    def get_user_meals(self, user_id, date):
        return [meal for meal in self.meals 
                if str(meal.user_id) == str(user_id) and meal.date == date]
    
    def delete_meal(self, user_id, meal_id):
        meal = next((m for m in self.meals 
                    if str(m.id) == str(meal_id) and str(m.user_id) == str(user_id)), None)
        if meal:
            self.meals.remove(meal)
        else:
            raise Exception('Meal not found')
    
    def calculate_bmi(self, height, weight):
        if not height or not weight:
            raise Exception('Height and weight are required')
        height_in_m = height / 100
        return round(weight / (height_in_m ** 2), 2)
    
    def get_daily_summary(self, user_id, date):
        meals = self.get_user_meals(user_id, date)
        return {
            'total_calories': sum(meal.calories for meal in meals),
            'total_protein': sum(meal.protein for meal in meals),
            'total_carbs': sum(meal.carbs for meal in meals),
            'total_fats': sum(meal.fats for meal in meals),
            'meal_count': len(meals)
        }