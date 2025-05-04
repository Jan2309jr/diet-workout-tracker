async function loadUserProfile() {
    try {
        const user = await getCurrentUser();
        
        // Update profile info in dashboard
        const profileInfoEl = document.getElementById('profileInfo');
        if (profileInfoEl) {
            profileInfoEl.innerHTML = `
                <h2 class="text-xl font-semibold">Welcome, ${user.name}</h2>
                <p class="text-gray-600">${user.age} years • ${user.gender}</p>
                <p class="text-gray-600">${user.height} cm • ${user.weight} kg</p>
                <p class="text-gray-600">Goal: ${formatFitnessGoal(user.fitness_goal)}</p>
            `;
        }
        
        // Update profile form fields
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.querySelector('#profileName').value = user.name;
            profileForm.querySelector('#profileAge').value = user.age;
            profileForm.querySelector('#profileGender').value = user.gender;
            profileForm.querySelector('#profileHeight').value = user.height;
            profileForm.querySelector('#profileWeight').value = user.weight;
            profileForm.querySelector('#profileFitnessGoal').value = user.fitness_goal;
        }
    } catch (error) {
        showAlert('error', error.message);
    }
}

function formatFitnessGoal(goal) {
    switch (goal) {
        case 'loss': return 'Weight Loss';
        case 'gain': return 'Weight Gain';
        case 'maintenance': return 'Weight Maintenance';
        default: return goal;
    }
}

// API functions
async function loginUser(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }
    return data;
}

async function registerUser(name, email, password, age, gender, height, weight, fitnessGoal) {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password,
            age,
            gender,
            height,
            weight,
            fitness_goal: fitnessGoal
        })
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }
    return data;
}

async function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch('/api/users/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user data');
    }
    return data;
}

async function updateProfile(name, age, gender, height, weight, fitnessGoal) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            age,
            gender,
            height,
            weight,
            fitness_goal: fitnessGoal
        })
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
    }
    return data;
}

async function getDailySummary(date) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch(`/api/summary?date=${date}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch daily summary');
    }
    return data;
}

async function getMeals(date) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch(`/api/meals?date=${date}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch meals');
    }
    return data;
}

async function addMeal(name, calories, protein, carbs, fats, time, date) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            calories,
            protein,
            carbs,
            fats,
            time,
            date
        })
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to add meal');
    }
    return data;
}

async function deleteMeal(mealId) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch(`/api/meals/${mealId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete meal');
    }
}

async function getWorkouts(date) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch(`/api/workouts?date=${date}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch workouts');
    }
    return data;
}

async function addWorkout(name, caloriesBurned, duration, intensity, date) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            calories_burned: caloriesBurned,
            duration,
            intensity,
            date
        })
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to add workout');
    }
    return data;
}

async function deleteWorkout(workoutId) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete workout');
    }
}

async function calculateBMI() {
    const user = await getCurrentUser();
    if (!user.height || !user.weight) {
        throw new Error('Height and weight are required to calculate BMI');
    }
    
    // BMI formula: weight (kg) / (height (m))^2
    const heightInMeters = user.height / 100;
    return user.weight / (heightInMeters * heightInMeters);
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Load user profile if on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        loadUserProfile();
        loadDashboardData(new Date().toISOString().split('T')[0]);
    }
});