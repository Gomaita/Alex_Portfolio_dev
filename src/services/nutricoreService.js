import { initialMealPlans, initialUsers, initialWeightLogs, initialWorkoutPlans } from '../data/nutricoreData'

const STORAGE_KEY = 'nutricore-demo-state-v1'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}`
}

function recalculateMealPlan(plan) {
  return {
    ...plan,
    meals: plan.meals.map((meal) => ({
      ...meal,
      options: meal.options.map((option) => ({
        ...option,
        totals: option.foods.reduce((acc, item) => ({
          kcal: acc.kcal + Number(item.kcal || 0),
          protein: acc.protein + Number(item.protein || 0),
          carbs: acc.carbs + Number(item.carbs || 0),
          fat: acc.fat + Number(item.fat || 0),
        }), { kcal: 0, protein: 0, carbs: 0, fat: 0 }),
      })),
    })),
  }
}

export function createInitialNutriCoreState() {
  return {
    users: clone(initialUsers),
    mealPlans: clone(initialMealPlans),
    workoutPlans: clone(initialWorkoutPlans),
    weightLogs: clone(initialWeightLogs),
    changes: [
      'Demo data loaded',
      'Meal templates created',
      'Workout templates assigned',
    ],
  }
}

export function loadNutriCoreState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (stored?.users && stored?.mealPlans && stored?.workoutPlans && stored?.weightLogs) {
      return stored
    }
  } catch {
    // Use the initial state if localStorage contains invalid data.
  }
  return createInitialNutriCoreState()
}

export function saveNutriCoreState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetNutriCoreState() {
  const state = createInitialNutriCoreState()
  saveNutriCoreState(state)
  return state
}

export function updateUser(state, userId, patch) {
  const nextState = {
    ...state,
    users: state.users.map((user) => (user.id === userId ? { ...user, ...patch } : user)),
    changes: [`User updated: ${patch.name || userId}`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return nextState
}

export function createUser(state) {
  const id = makeId('user')
  const firstDiet = state.mealPlans[0]?.id || ''
  const firstWorkout = state.workoutPlans[0]?.id || ''
  const user = {
    id,
    name: 'Nuevo usuario',
    age: 25,
    goal: 'Objetivo personalizado',
    weight: 70,
    height: 170,
    level: 'Principiante',
    activity: '3 sesiones por semana',
    preferences: 'Sin preferencias',
    allergies: 'Ninguna',
    injuries: 'Ninguna',
    dietId: firstDiet,
    workoutId: firstWorkout,
    adminNote: 'Nuevo usuario demo creado desde el panel admin.',
    personalNotes: '',
  }
  const nextState = {
    ...state,
    users: [...state.users, user],
    weightLogs: { ...state.weightLogs, [id]: [{ date: new Date().toISOString().slice(0, 10), weight: user.weight }] },
    changes: ['User created: Nuevo usuario', ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return { state: nextState, id }
}

export function deleteUser(state, userId) {
  if (state.users.length <= 1) return state
  const nextLogs = { ...state.weightLogs }
  delete nextLogs[userId]
  const nextState = {
    ...state,
    users: state.users.filter((user) => user.id !== userId),
    weightLogs: nextLogs,
    changes: [`User deleted: ${userId}`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return nextState
}

export function addWeightLog(state, userId, log) {
  const currentLogs = state.weightLogs[userId] || []
  const nextLogs = [...currentLogs, log].sort((a, b) => a.date.localeCompare(b.date))
  const nextState = {
    ...state,
    users: state.users.map((user) => (user.id === userId ? { ...user, weight: Number(log.weight) } : user)),
    weightLogs: { ...state.weightLogs, [userId]: nextLogs },
    changes: [`Weight logged: ${log.weight} kg`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return nextState
}

export function updateMealPlan(state, planId, patch) {
  const nextState = {
    ...state,
    mealPlans: state.mealPlans.map((plan) => (plan.id === planId ? recalculateMealPlan({ ...plan, ...patch }) : plan)),
    changes: [`Diet updated: ${patch.name || planId}`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return nextState
}

export function createMealPlan(state) {
  const sourcePlan = clone(state.mealPlans[0])
  const id = makeId('diet')
  const nextPlan = recalculateMealPlan({
    ...sourcePlan,
    id,
    name: 'Nueva dieta personalizada',
    target: 'Objetivo personalizado',
  })
  const nextState = {
    ...state,
    mealPlans: [...state.mealPlans, nextPlan],
    changes: ['Diet created: Nueva dieta personalizada', ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return { state: nextState, id }
}

export function duplicateMealPlan(state, planId) {
  const sourcePlan = state.mealPlans.find((plan) => plan.id === planId)
  if (!sourcePlan) return { state, id: planId }
  const id = makeId('diet')
  const nextPlan = recalculateMealPlan({ ...clone(sourcePlan), id, name: `${sourcePlan.name} copia` })
  const nextState = {
    ...state,
    mealPlans: [...state.mealPlans, nextPlan],
    changes: [`Diet duplicated: ${sourcePlan.name}`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return { state: nextState, id }
}

export function deleteMealPlan(state, planId) {
  if (state.mealPlans.length <= 1) return state
  const fallbackPlan = state.mealPlans.find((plan) => plan.id !== planId)
  const nextState = {
    ...state,
    users: state.users.map((user) => (user.dietId === planId ? { ...user, dietId: fallbackPlan.id } : user)),
    mealPlans: state.mealPlans.filter((plan) => plan.id !== planId),
    changes: [`Diet deleted: ${planId}`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return nextState
}

export function updateWorkoutPlan(state, planId, patch) {
  const nextState = {
    ...state,
    workoutPlans: state.workoutPlans.map((plan) => (plan.id === planId ? { ...plan, ...patch } : plan)),
    changes: [`Workout updated: ${patch.name || planId}`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return nextState
}

export function createWorkoutPlan(state) {
  const sourcePlan = clone(state.workoutPlans[0])
  const id = makeId('workout')
  const nextPlan = {
    ...sourcePlan,
    id,
    name: 'Nueva rutina personalizada',
    description: 'Completa los dias en orden, sin depender del calendario semanal.',
  }
  const nextState = {
    ...state,
    workoutPlans: [...state.workoutPlans, nextPlan],
    changes: ['Workout created: Nueva rutina personalizada', ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return { state: nextState, id }
}

export function duplicateWorkoutPlan(state, planId) {
  const sourcePlan = state.workoutPlans.find((plan) => plan.id === planId)
  if (!sourcePlan) return { state, id: planId }
  const id = makeId('workout')
  const nextPlan = { ...clone(sourcePlan), id, name: `${sourcePlan.name} copia` }
  const nextState = {
    ...state,
    workoutPlans: [...state.workoutPlans, nextPlan],
    changes: [`Workout duplicated: ${sourcePlan.name}`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return { state: nextState, id }
}

export function deleteWorkoutPlan(state, planId) {
  if (state.workoutPlans.length <= 1) return state
  const fallbackPlan = state.workoutPlans.find((plan) => plan.id !== planId)
  const nextState = {
    ...state,
    users: state.users.map((user) => (user.workoutId === planId ? { ...user, workoutId: fallbackPlan.id } : user)),
    workoutPlans: state.workoutPlans.filter((plan) => plan.id !== planId),
    changes: [`Workout deleted: ${planId}`, ...state.changes].slice(0, 8),
  }
  saveNutriCoreState(nextState)
  return nextState
}
