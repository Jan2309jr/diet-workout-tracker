from flask import Flask, jsonify, request
from flask_cors import CORS
from models.user import User
from models.meal import Meal
from models.workout import Workout
from services.auth import AuthService
from services.diet import DietService
from services.workout import WorkoutService
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') or 'your-secret-key-here'

# Initialize services
auth_service = AuthService()
diet_service = DietService()
workout_service = WorkoutService()

# Helper function for token verification
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = auth_service.get_user_by_id(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = auth_service.register_user(
            data['name'],
            data['email'],
            data['password'],
            data.get('age'),
            data.get('gender'),
            data.get('height'),
            data.get('weight'),
            data.get('fitness_goal')
        )
        token = jwt.encode({
            'user_id': str(user.id),
            'exp': datetime.utcnow() + timedelta(days=30)
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token, 'user': user.to_dict()}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        user = auth_service.login_user(data['email'], data['password'])
        token = jwt.encode({
            'user_id': str(user.id),
            'exp': datetime.utcnow() + timedelta(days=30)
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token, 'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 401

# User Profile Routes
@app.route('/api/user', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify(current_user.to_dict()), 200

@app.route('/api/user', methods=['PUT'])
@token_required
def update_user(current_user):
    data = request.get_json()
    try:
        updated_user = auth_service.update_user(
            current_user.id,
            data.get('name'),
            data.get('age'),
            data.get('gender'),
            data.get('height'),
            data.get('weight'),
            data.get('fitness_goal')
        )
        return jsonify(updated_user.to_dict()), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# Diet Routes
@app.route('/api/meals', methods=['GET'])
@token_required
def get_meals(current_user):
    date = request.args.get('date', str(datetime.now().date()))
    meals = diet_service.get_user_meals(current_user.id, date)
    return jsonify([meal.to_dict() for meal in meals]), 200

@app.route('/api/meals', methods=['POST'])
@token_required
def add_meal(current_user):
    data = request.get_json()
    try:
        meal = diet_service.add_meal(
            current_user.id,
            data['name'],
            data['calories'],
            data['protein'],
            data['carbs'],
            data['fats'],
            data.get('time', datetime.now().strftime('%H:%M')),
            data.get('date', str(datetime.now().date()))
        )
        return jsonify(meal.to_dict()), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@app.route('/api/meals/<meal_id>', methods=['DELETE'])
@token_required
def delete_meal(current_user, meal_id):
    try:
        diet_service.delete_meal(current_user.id, meal_id)
        return jsonify({'message': 'Meal deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# Workout Routes
@app.route('/api/workouts', methods=['GET'])
@token_required
def get_workouts(current_user):
    date = request.args.get('date', str(datetime.now().date()))
    workouts = workout_service.get_user_workouts(current_user.id, date)
    return jsonify([workout.to_dict() for workout in workouts]), 200

@app.route('/api/workouts', methods=['POST'])
@token_required
def add_workout(current_user):
    data = request.get_json()
    try:
        workout = workout_service.add_workout(
            current_user.id,
            data['name'],
            data['calories_burned'],
            data['duration'],
            data.get('intensity', 'medium'),
            data.get('date', str(datetime.now().date()))
        )
        return jsonify(workout.to_dict()), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@app.route('/api/workouts/<workout_id>', methods=['DELETE'])
@token_required
def delete_workout(current_user, workout_id):
    try:
        workout_service.delete_workout(current_user.id, workout_id)
        return jsonify({'message': 'Workout deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# Analytics Routes
@app.route('/api/analytics/bmi', methods=['GET'])
@token_required
def calculate_bmi(current_user):
    try:
        bmi = diet_service.calculate_bmi(current_user.height, current_user.weight)
        return jsonify({'bmi': bmi}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@app.route('/api/analytics/daily-summary', methods=['GET'])
@token_required
def get_daily_summary(current_user):
    date = request.args.get('date', str(datetime.now().date()))
    try:
        summary = {
            'diet': diet_service.get_daily_summary(current_user.id, date),
            'workout': workout_service.get_daily_summary(current_user.id, date)
        }
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)