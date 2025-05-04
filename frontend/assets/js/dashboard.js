// ... (continuing from previous code)

// Render workouts list
function renderWorkouts() {
    if (todayWorkouts.length === 0) {
        workoutsListElement.innerHTML = '<p class="text-gray-500">No workouts logged today.</p>';
        return;
    }
    
    workoutsListElement.innerHTML = todayWorkouts.map(workout => `
        <div class="p-4 border rounded-lg">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-semibold">${workout.name}</h3>
                    <p class="text-gray-600 text-sm capitalize">${workout.type}</p>
                </div>
                <button class="delete-workout text-red-500 hover:text-red-700" data-id="${workout._id}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
            <div class="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div>
                    <p class="text-gray-600">Duration</p>
                    <p>${workout.duration} min</p>
                </div>
                <div>
                    <p class="text-gray-600">Calories</p>
                    <p>${workout.caloriesBurned} kcal</p>
                </div>
                <div>
                    <p class="text-gray-600">Intensity</p>
                    <p class="capitalize">${workout.intensity}</p>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-workout').forEach(button => {
        button.addEventListener('click', async (e) => {
            const workoutId = e.currentTarget.getAttribute('data-id');
            await deleteWorkout(workoutId);
        });
    });
}

// Delete a workout
async function deleteWorkout(workoutId) {
    const token = localStorage.getItem('token');
    if (!token || !confirm('Are you sure you want to delete this workout?')) return;
    
    try {
        await workoutAPI.deleteWorkout(currentUser._id, workoutId, token);
        todayWorkouts = todayWorkouts.filter(workout => workout._id !== workoutId);
        renderWorkouts();
        updateWorkoutSummary();
    } catch (error) {
        console.error('Failed to delete workout:', error);
        alert('Failed to delete workout. Please try again.');
    }
}

// Update workout summary
function updateWorkoutSummary() {
    const totals = todayWorkouts.reduce((acc, workout) => {
        acc.exercises += 1;
        acc.duration += workout.duration;
        acc.caloriesBurned += workout.caloriesBurned;
        return acc;
    }, { exercises: 0, duration: 0, caloriesBurned: 0 });
    
    totalExercisesElement.textContent = totals.exercises;
    totalDurationElement.textContent = totals.duration;
    totalCaloriesBurnedElement.textContent = totals.caloriesBurned;
}

// Load recommendations
async function loadRecommendations(token) {
    try {
        const recommendations = await recommendationsAPI.getRecommendations(currentUser._id, token);
        renderRecommendations(recommendations);
    } catch (error) {
        console.error('Failed to load recommendations:', error);
        recommendationsElement.innerHTML = '<p class="text-gray-500">Failed to load recommendations.</p>';
    }
}

// Render recommendations
function renderRecommendations(recommendations) {
    if (!recommendations || recommendations.length === 0) {
        recommendationsElement.innerHTML = '<p class="text-gray-500">No recommendations available.</p>';
        return;
    }
    
    recommendationsElement.innerHTML = `
        <div class="space-y-4">
            ${recommendations.map(rec => `
                <div class="p-4 bg-blue-50 rounded-lg">
                    <h3 class="font-semibold text-blue-800">${rec.title}</h3>
                    <p class="text-blue-700 mt-1">${rec.message}</p>
                    ${rec.action ? `<a href="${rec.action.url}" class="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800">${rec.action.text}</a>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Set up event listeners
function setupEventListeners() {
    // Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
    
    // Meal modal
    addMealButton.addEventListener('click', () => {
        mealModal.classList.remove('hidden');
    });
    
    cancelMealButton.addEventListener('click', () => {
        mealModal.classList.add('hidden');
        mealForm.reset();
    });
    
    // Workout modal
    addWorkoutButton.addEventListener('click', () => {
        workoutModal.classList.remove('hidden');
    });
    
    cancelWorkoutButton.addEventListener('click', () => {
        workoutModal.classList.add('hidden');
        workoutForm.reset();
    });
    
    // BMI Calculator
    calculateBMIButton.addEventListener('click', calculateBMI);
    
    // Update fitness goal
    updateGoalButton.addEventListener('click', updateFitnessGoal);
    
    // Form submissions
    mealForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await addMeal();
    });
    
    workoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await addWorkout();
    });
}

// Calculate BMI
function calculateBMI() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    
    if (!height || !weight) {
        alert('Please enter both height and weight');
        return;
    }
    
    // BMI formula: weight (kg) / (height (m) ^ 2)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    bmiValue.textContent = bmi.toFixed(1);
    
    // Determine BMI category
    let category, recommendation;
    if (bmi < 18.5) {
        category = 'Underweight';
        recommendation = 'Consider consulting a nutritionist to gain weight healthily.';
    } else if (bmi < 25) {
        category = 'Normal weight';
        recommendation = 'Maintain your healthy lifestyle!';
    } else if (bmi < 30) {
        category = 'Overweight';
        recommendation = 'Consider increasing physical activity and adjusting your diet.';
    } else {
        category = 'Obese';
        recommendation = 'Consult with a healthcare professional for guidance on weight management.';
    }
    
    bmiCategory.textContent = category;
    bmiRecommendation.textContent = recommendation;
    bmiResult.classList.remove('hidden');
}

// Update fitness goal
async function updateFitnessGoal() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const fitnessGoal = fitnessGoalSelect.value;
    const targetWeight = parseFloat(targetWeightInput.value);
    
    if (!fitnessGoal) {
        alert('Please select a fitness goal');
        return;
    }
    
    try {
        await userAPI.updateUser(currentUser._id, { 
            fitnessGoal, 
            targetWeight 
        }, token);
        
        currentUser.fitnessGoal = fitnessGoal;
        currentUser.targetWeight = targetWeight;
        displayUserData(currentUser);
        
        // Reload recommendations as they might change based on goal
        await loadRecommendations(token);
        
        alert('Fitness goal updated successfully!');
    } catch (error) {
        console.error('Failed to update fitness goal:', error);
        alert('Failed to update fitness goal. Please try again.');
    }
}

// Add a new meal
async function addMeal() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const formData = new FormData(mealForm);
    const mealData = {
        name: formData.get('meal-name'),
        time: formData.get('meal-time'),
        calories: parseInt(formData.get('calories')),
        protein: parseInt(formData.get('protein')),
        carbs: parseInt(formData.get('carbs')),
        notes: formData.get('notes')
    };
    
    try {
        const newMeal = await mealAPI.addMeal(currentUser._id, mealData, token);
        todayMeals.push(newMeal);
        renderMeals();
        updateNutritionSummary();
        
        mealModal.classList.add('hidden');
        mealForm.reset();
    } catch (error) {
        console.error('Failed to add meal:', error);
        alert('Failed to add meal. Please try again.');
    }
}

// Add a new workout
async function addWorkout() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const formData = new FormData(workoutForm);
    const workoutData = {
        name: formData.get('workout-name'),
        type: formData.get('workout-type'),
        duration: parseInt(formData.get('duration')),
        intensity: formData.get('intensity'),
        caloriesBurned: parseInt(formData.get('calories-burned')),
        notes: formData.get('notes')
    };
    
    try {
        const newWorkout = await workoutAPI.addWorkout(currentUser._id, workoutData, token);
        todayWorkouts.push(newWorkout);
        renderWorkouts();
        updateWorkoutSummary();
        
        workoutModal.classList.add('hidden');
        workoutForm.reset();
    } catch (error) {
        console.error('Failed to add workout:', error);
        alert('Failed to add workout. Please try again.');
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initDashboard);