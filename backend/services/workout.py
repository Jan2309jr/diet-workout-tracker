from models.workout import Workout
from datetime import datetime

class WorkoutService:
    def __init__(self):
        # In a real app, this would be your database connection
        self.workouts = []
        
    def add_workout(self, user_id, name, calories_burned, duration, intensity, date):
        workout = Workout(
            user_id=user_id,
            name=name,
            calories_burned=calories_burned,
            duration=duration,
            intensity=intensity,
            date=date
        )
        
        # Save to database in real app
        workout.id = len(self.workouts) + 1  # Simulate auto-increment ID
        self.workouts.append(workout)
        return workout
    
    def get_user_workouts(self, user_id, date):
        return [workout for workout in self.workouts 
                if str(workout.user_id) == str(user_id) and workout.date == date]
    
    def delete_workout(self, user_id, workout_id):
        workout = next((w for w in self.workouts 
                       if str(w.id) == str(workout_id) and str(w.user_id) == str(user_id)), None)
        if workout:
            self.workouts.remove(workout)
        else:
            raise Exception('Workout not found')
    
    def get_daily_summary(self, user_id, date):
        workouts = self.get_user_workouts(user_id, date)
        return {
            'total_calories_burned': sum(w.calories_burned for w in workouts),
            'total_duration': sum(w.duration for w in workouts),
            'workout_count': len(workouts)
        }