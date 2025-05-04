// Base API URL - Update this to match your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for making API requests
async function makeRequest(url, method = 'GET', data = null, token = null) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
        method: method,
        headers: headers,
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Authentication API
export const authAPI = {
    async register(userData) {
        return makeRequest('/auth/register', 'POST', userData);
    },
    
    async login(credentials) {
        return makeRequest('/auth/login', 'POST', credentials);
    },
    
    async getCurrentUser(token) {
        return makeRequest('/auth/me', 'GET', null, token);
    },
    
    async logout(token) {
        return makeRequest('/auth/logout', 'POST', null, token);
    }
};

// User API
export const userAPI = {
    async updateProfile(userId, data, token) {
        return makeRequest(`/users/${userId}`, 'PUT', data, token);
    },
    
    async updateGoal(userId, goalData, token) {
        return makeRequest(`/users/${userId}/goal`, 'PUT', goalData, token);
    },
    
    async calculateBMI(userId, bmiData, token) {
        return makeRequest(`/users/${userId}/bmi`, 'POST', bmiData, token);
    }
};

// Meal API
export const mealAPI = {
    async getMeals(userId, date, token) {
        return makeRequest(`/users/${userId}/meals?date=${date}`, 'GET', null, token);
    },
    
    async addMeal(userId, mealData, token) {
        return makeRequest(`/users/${userId}/meals`, 'POST', mealData, token);
    },
    
    async deleteMeal(userId, mealId, token) {
        return makeRequest(`/users/${userId}/meals/${mealId}`, 'DELETE', null, token);
    }
};

// Workout API
export const workoutAPI = {
    async getWorkouts(userId, date, token) {
        return makeRequest(`/users/${userId}/workouts?date=${date}`, 'GET', null, token);
    },
    
    async addWorkout(userId, workoutData, token) {
        return makeRequest(`/users/${userId}/workouts`, 'POST', workoutData, token);
    },
    
    async deleteWorkout(userId, workoutId, token) {
        return makeRequest(`/users/${userId}/workouts/${workoutId}`, 'DELETE', null, token);
    }
};

// Recommendations API
export const recommendationsAPI = {
    async getRecommendations(userId, token) {
        return makeRequest(`/users/${userId}/recommendations`, 'GET', null, token);
    }
};