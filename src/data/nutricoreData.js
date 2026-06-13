export const mealNames = ['Desayuno', 'Almuerzo', 'Comida', 'Merienda', 'Cena']

export const initialUsers = [
  {
    id: 'user-alex',
    name: 'Alex Gómez',
    age: 24,
    goal: 'Recomposición corporal',
    weight: 74.2,
    height: 176,
    level: 'Intermedio',
    activity: '4-5 sesiones por semana',
    preferences: 'Alta proteína, comidas simples',
    allergies: 'Ninguna',
    injuries: 'Molestia leve en hombro derecho',
    dietId: 'diet-high-protein',
    workoutId: 'workout-ppl-torso',
    adminNote: 'Priorizar técnica y progresión lenta en empujes.',
  },
  {
    id: 'user-marta',
    name: 'Marta Ruiz',
    age: 31,
    goal: 'Pérdida de grasa',
    weight: 68.5,
    height: 165,
    level: 'Principiante',
    activity: '3 sesiones por semana',
    preferences: 'Dieta flexible',
    allergies: 'Lactosa',
    injuries: 'Ninguna',
    dietId: 'diet-moderate-deficit',
    workoutId: 'workout-full-body-3',
    adminNote: 'Mantener déficit moderado y pasos diarios constantes.',
  },
  {
    id: 'user-carlos',
    name: 'Carlos Pérez',
    age: 28,
    goal: 'Ganar masa muscular',
    weight: 81.3,
    height: 181,
    level: 'Avanzado',
    activity: '5 sesiones por semana',
    preferences: 'Volumen limpio',
    allergies: 'Ninguna',
    injuries: 'Rodilla izquierda sensible',
    dietId: 'diet-clean-bulk',
    workoutId: 'workout-upper-lower-4',
    adminNote: 'Controlar volumen de pierna y priorizar recuperación.',
  },
  {
    id: 'user-lucia',
    name: 'Lucía Martín',
    age: 35,
    goal: 'Mantenimiento saludable',
    weight: 59.8,
    height: 162,
    level: 'Activo',
    activity: 'Fuerza + movilidad',
    preferences: 'Equilibrada, alta en vegetales',
    allergies: 'Frutos secos',
    injuries: 'Tensión cervical ocasional',
    dietId: 'diet-balanced',
    workoutId: 'workout-beginner-gym',
    adminNote: 'Añadir movilidad de cadera y cuello al final de sesión.',
  },
]

export const initialWeightLogs = {
  'user-alex': [
    { date: '2026-05-01', weight: 76.0 },
    { date: '2026-05-08', weight: 75.5 },
    { date: '2026-05-15', weight: 75.0 },
    { date: '2026-05-22', weight: 74.6 },
    { date: '2026-06-01', weight: 74.2 },
  ],
  'user-marta': [
    { date: '2026-05-01', weight: 70.1 },
    { date: '2026-05-08', weight: 69.6 },
    { date: '2026-05-15', weight: 69.1 },
    { date: '2026-05-22', weight: 68.8 },
    { date: '2026-06-01', weight: 68.5 },
  ],
  'user-carlos': [
    { date: '2026-05-01', weight: 80.2 },
    { date: '2026-05-08', weight: 80.5 },
    { date: '2026-05-15', weight: 80.9 },
    { date: '2026-05-22', weight: 81.0 },
    { date: '2026-06-01', weight: 81.3 },
  ],
  'user-lucia': [
    { date: '2026-05-01', weight: 60.0 },
    { date: '2026-05-08', weight: 59.9 },
    { date: '2026-05-15', weight: 59.7 },
    { date: '2026-05-22', weight: 59.9 },
    { date: '2026-06-01', weight: 59.8 },
  ],
}

function food(name, quantity, unit, prep, kcal, protein, carbs, fat, note = '') {
  return { name, quantity, unit, prep, kcal, protein, carbs, fat, note }
}

function option(name, foods) {
  const totals = foods.reduce((acc, item) => ({
    kcal: acc.kcal + item.kcal,
    protein: acc.protein + item.protein,
    carbs: acc.carbs + item.carbs,
    fat: acc.fat + item.fat,
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 })
  return { name, foods, totals }
}

function createMeals(profile) {
  return mealNames.map((mealName, index) => ({
    id: `${profile}-${index}`,
    name: mealName,
    options: [
      option('Opción 1', [
        food(index === 0 ? 'Avena' : 'Arroz basmati', index === 0 ? 60 : 80, 'g', index === 0 ? 'seco' : 'en crudo', index === 0 ? 228 : 288, index === 0 ? 8 : 6, index === 0 ? 38 : 62, index === 0 ? 4 : 1),
        food(index === 0 ? 'Yogur griego' : 'Pechuga de pollo', index === 0 ? 200 : 180, 'g', index === 0 ? 'al natural' : 'en crudo', index === 0 ? 118 : 198, index === 0 ? 20 : 42, index === 0 ? 8 : 0, index === 0 ? 1 : 4),
        food(index === 0 ? 'Plátano' : 'Verduras variadas', index === 0 ? 120 : 200, 'g', index === 0 ? 'al natural' : 'cocido', index === 0 ? 105 : 70, index === 0 ? 1 : 4, index === 0 ? 27 : 12, index === 0 ? 0 : 1),
      ]),
      option('Opción 2', [
        food(index === 0 ? 'Pan integral' : 'Patata', index === 0 ? 90 : 300, 'g', index === 0 ? 'preparado' : 'cocido', index === 0 ? 225 : 240, index === 0 ? 9 : 6, index === 0 ? 42 : 54, index === 0 ? 3 : 0),
        food(index === 0 ? 'Huevos' : 'Salmón', index === 0 ? 2 : 150, index === 0 ? 'ud' : 'g', index === 0 ? 'preparado' : 'en crudo', index === 0 ? 156 : 300, index === 0 ? 13 : 30, index === 0 ? 1 : 0, index === 0 ? 10 : 19),
        food('Aceite de oliva', 10, 'g', 'opcional / no aplica', 90, 0, 0, 10),
      ]),
      option('Opción 3', [
        food(index === 0 ? 'Tortitas de arroz' : 'Pasta integral', index === 0 ? 4 : 85, index === 0 ? 'ud' : 'g', index === 0 ? 'seco' : 'en crudo', index === 0 ? 112 : 300, index === 0 ? 2 : 11, index === 0 ? 24 : 60, index === 0 ? 1 : 2),
        food(index === 0 ? 'Queso fresco batido' : 'Ternera magra', index === 0 ? 250 : 160, 'g', index === 0 ? 'al natural' : 'en crudo', index === 0 ? 135 : 240, index === 0 ? 25 : 34, index === 0 ? 10 : 0, index === 0 ? 1 : 10),
        food('Fruta', 150, 'g', 'al natural', 80, 1, 20, 0),
      ]),
    ],
  }))
}

export const initialMealPlans = [
  { id: 'diet-high-protein', name: 'Alta en proteína', target: 'Recomposición corporal', kcal: 2350, meals: createMeals('high-protein') },
  { id: 'diet-moderate-deficit', name: 'Déficit moderado', target: 'Pérdida de grasa', kcal: 1850, meals: createMeals('deficit') },
  { id: 'diet-clean-bulk', name: 'Volumen limpio', target: 'Ganar masa muscular', kcal: 2850, meals: createMeals('bulk') },
  { id: 'diet-balanced', name: 'Equilibrada', target: 'Mantenimiento saludable', kcal: 2100, meals: createMeals('balanced') },
  { id: 'diet-vegetarian-protein', name: 'Vegetariana alta en proteína', target: 'Rendimiento y salud', kcal: 2200, meals: createMeals('vegetarian') },
]

function exercise(name, muscle, sets, reps, rest, rir, notes, alternative = '') {
  return { name, muscle, sets, reps, rest, rir, notes, alternative }
}

function day(id, name, muscles, duration, difficulty, exercises) {
  return { id, name, muscles, duration, difficulty, status: 'Pendiente', exercises }
}

export const initialWorkoutPlans = [
  {
    id: 'workout-ppl-torso',
    name: 'Push Pull Legs + Torso',
    description: 'Completa los días en orden, sin importar el día de la semana.',
    days: [
      day('day-1', 'Día 1 - Empuje', 'Pecho, hombro, tríceps', '65 min', 'Intermedia', [
        exercise('Press banca', 'Pecho', 4, '8-10', '90 s', 'RIR 2', 'Controla la bajada y evita rebotar la barra.', 'Press mancuernas'),
        exercise('Press militar', 'Hombro', 3, '8-10', '90 s', 'RIR 2', 'Mantén abdomen activo.'),
        exercise('Fondos asistidos', 'Tríceps', 3, '10-12', '75 s', 'RIR 1', 'No fuerces el hombro.'),
      ]),
      day('day-2', 'Día 2 - Tirón', 'Espalda, bíceps', '60 min', 'Intermedia', [
        exercise('Dominadas asistidas', 'Espalda', 4, '6-10', '120 s', 'RIR 2', 'Busca rango completo.'),
        exercise('Remo con barra', 'Espalda', 4, '8-10', '90 s', 'RIR 2', 'Espalda neutra.'),
        exercise('Curl inclinado', 'Bíceps', 3, '10-12', '60 s', 'RIR 1', 'Evita balanceo.'),
      ]),
      day('day-3', 'Día 3 - Pierna', 'Cuádriceps, femoral, glúteo', '70 min', 'Intermedia', [
        exercise('Sentadilla', 'Pierna', 4, '6-8', '120 s', 'RIR 2', 'Profundidad cómoda y estable.'),
        exercise('Peso muerto rumano', 'Femoral', 3, '8-10', '90 s', 'RIR 2', 'Bisagra de cadera.'),
        exercise('Prensa', 'Cuádriceps', 3, '10-12', '90 s', 'RIR 1', 'No bloquees rodillas.'),
      ]),
      day('day-4', 'Día 4 - Torso', 'Torso completo', '60 min', 'Intermedia', [
        exercise('Press inclinado', 'Pecho', 3, '8-10', '90 s', 'RIR 2', 'Control y estabilidad.'),
        exercise('Jalón al pecho', 'Espalda', 3, '10-12', '75 s', 'RIR 2', 'Lleva codos abajo.'),
        exercise('Elevaciones laterales', 'Hombro', 4, '12-15', '45 s', 'RIR 1', 'Sin impulso.'),
      ]),
    ],
  },
  {
    id: 'workout-full-body-3',
    name: 'Full Body 3 días',
    description: 'Completa los días en orden, sin importar el día de la semana.',
    days: [
      day('fb-1', 'Día 1 - Full Body Base', 'Cuerpo completo', '50 min', 'Principiante', [
        exercise('Goblet squat', 'Pierna', 3, '10-12', '75 s', 'RIR 3', 'Movimiento controlado.'),
        exercise('Press mancuernas', 'Pecho', 3, '10-12', '75 s', 'RIR 2', 'Escápulas estables.'),
        exercise('Remo polea', 'Espalda', 3, '10-12', '75 s', 'RIR 2', 'Tira con codos.'),
      ]),
      day('fb-2', 'Día 2 - Fuerza Técnica', 'Cuerpo completo', '50 min', 'Principiante', [
        exercise('Prensa', 'Pierna', 3, '10', '90 s', 'RIR 2', 'Rango cómodo.'),
        exercise('Jalón neutro', 'Espalda', 3, '10', '75 s', 'RIR 2', 'Controla la subida.'),
        exercise('Plancha', 'Core', 3, '30-40 s', '45 s', '', 'Respira normal.'),
      ]),
      day('fb-3', 'Día 3 - Metabólico', 'Cuerpo completo', '45 min', 'Principiante', [
        exercise('Zancadas', 'Pierna', 3, '10 por pierna', '75 s', 'RIR 2', 'Paso estable.'),
        exercise('Press máquina', 'Pecho', 3, '12', '60 s', 'RIR 2', 'Control.'),
        exercise('Face pull', 'Hombro posterior', 3, '15', '45 s', 'RIR 1', 'Codos altos.'),
      ]),
    ],
  },
  {
    id: 'workout-upper-lower-4',
    name: 'Torso Pierna 4 días',
    description: 'Completa los días en orden, sin importar el día de la semana.',
    days: [
      day('ul-1', 'Día 1 - Torso Fuerza', 'Torso', '65 min', 'Avanzada', [exercise('Press banca', 'Pecho', 4, '5-6', '150 s', 'RIR 2', 'Pesado y técnico.'), exercise('Remo pesado', 'Espalda', 4, '6-8', '120 s', 'RIR 2', 'Sin balanceo.')]),
      day('ul-2', 'Día 2 - Pierna Fuerza', 'Pierna', '70 min', 'Avanzada', [exercise('Sentadilla', 'Pierna', 4, '5-6', '150 s', 'RIR 2', 'Técnica sólida.'), exercise('Hip thrust', 'Glúteo', 4, '8', '120 s', 'RIR 2', 'Pausa arriba.')]),
      day('ul-3', 'Día 3 - Torso Volumen', 'Torso', '60 min', 'Avanzada', [exercise('Press inclinado', 'Pecho', 3, '10', '90 s', 'RIR 2', 'Control.'), exercise('Jalón', 'Espalda', 4, '10-12', '75 s', 'RIR 1', 'Rango completo.')]),
      day('ul-4', 'Día 4 - Pierna Volumen', 'Pierna', '65 min', 'Avanzada', [exercise('Peso muerto rumano', 'Femoral', 4, '8-10', '120 s', 'RIR 2', 'Bisagra.'), exercise('Extensión cuádriceps', 'Cuádriceps', 3, '12-15', '60 s', 'RIR 1', 'Pausa arriba.')]),
    ],
  },
  {
    id: 'workout-beginner-gym',
    name: 'Principiante gimnasio',
    description: 'Completa los días en orden, sin importar el día de la semana.',
    days: [day('bg-1', 'Día 1 - Técnica', 'Cuerpo completo', '45 min', 'Fácil', [exercise('Prensa', 'Pierna', 3, '12', '60 s', 'RIR 3', 'Aprender rango.'), exercise('Remo máquina', 'Espalda', 3, '12', '60 s', 'RIR 3', 'Control.')])],
  },
  {
    id: 'workout-home',
    name: 'Casa sin material',
    description: 'Completa los días en orden, sin importar el día de la semana.',
    days: [day('home-1', 'Día 1 - Full Body / Core', 'Cuerpo completo', '35 min', 'Fácil', [exercise('Sentadilla libre', 'Pierna', 4, '12-15', '45 s', '', 'Control.'), exercise('Flexiones', 'Pecho', 4, 'AMRAP', '60 s', '', 'Adaptar inclinación.')])],
  },
]

export const initialExerciseLibrary = initialWorkoutPlans.flatMap((plan) => plan.days.flatMap((trainingDay) => trainingDay.exercises))
