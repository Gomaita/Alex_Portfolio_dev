import {
  Activity,
  Apple,
  BarChart3,
  ClipboardList,
  Dumbbell,
  Home,
  LineChart as LineChartIcon,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  addWeightLog,
  createUser,
  createMealPlan,
  createWorkoutPlan,
  deleteUser,
  deleteMealPlan,
  deleteWorkoutPlan,
  duplicateMealPlan,
  duplicateWorkoutPlan,
  loadNutriCoreState,
  resetNutriCoreState,
  saveNutriCoreState,
  updateMealPlan,
  updateUser,
  updateWorkoutPlan,
} from '../services/nutricoreService'
import usePageTitle from '../hooks/usePageTitle'

const userTabs = ['Dashboard', 'Perfil', 'Dieta', 'Entrenamiento', 'Progreso']
const adminTabs = ['Admin Dashboard', 'Usuarios', 'Editor de dieta', 'Editor de rutina', 'Plantillas']
const userTabMeta = {
  Dashboard: { icon: Home, label: 'Inicio', description: 'Tu resumen diario' },
  Perfil: { icon: UserRound, label: 'Perfil', description: 'Actualiza tus datos y peso actual' },
  Dieta: { icon: Apple, label: 'Dieta', description: 'Consulta tus 5 comidas del día' },
  Entrenamiento: { icon: Dumbbell, label: 'Entrenamiento', description: 'Sigue tu siguiente sesión' },
  Progreso: { icon: BarChart3, label: 'Progreso', description: 'Revisa tu evolución de peso' },
}
const adminTabMeta = {
  'Admin Dashboard': { icon: ShieldCheck, label: 'Admin', description: 'Resumen de la plataforma' },
  Usuarios: { icon: Users, label: 'Usuarios', description: 'Gestiona perfiles y asignaciones' },
  'Editor de dieta': { icon: Apple, label: 'Dietas', description: 'Edita comidas y alimentos' },
  'Editor de rutina': { icon: Dumbbell, label: 'Rutinas', description: 'Edita días y ejercicios' },
  Plantillas: { icon: ClipboardList, label: 'Plantillas', description: 'Biblioteca de planes' },
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Card({ children, className = '' }) {
  return <section className={cx('nutricore-card rounded-3xl p-5', className)}>{children}</section>
}

function Badge({ children, tone = 'slate' }) {
  const tones = {
    green: 'nutricore-badge-green',
    amber: 'nutricore-badge-amber',
    cyan: 'nutricore-badge-cyan',
    slate: 'nutricore-badge',
  }
  return <span className={cx('rounded-full border px-2.5 py-1 text-xs font-bold', tones[tone])}>{children}</span>
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-[var(--nc-muted)]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="nutricore-input min-h-11 rounded-xl px-3 text-sm outline-none focus:border-emerald-400"
      />
    </label>
  )
}

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-[var(--nc-muted)]">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="nutricore-input min-h-11 rounded-xl px-3 text-sm outline-none focus:border-emerald-400">
        {children}
      </select>
    </label>
  )
}

function weightStats(logs = []) {
  if (!logs.length) return { initial: 0, current: 0, diff: 0, bestWeekly: 0 }
  const initial = logs[0].weight
  const current = logs[logs.length - 1].weight
  const weeklyChanges = logs.slice(1).map((log, index) => Number((log.weight - logs[index].weight).toFixed(1)))
  return {
    initial,
    current,
    diff: Number((current - initial).toFixed(1)),
    bestWeekly: weeklyChanges.length ? Math.min(...weeklyChanges.map(Math.abs)) : 0,
  }
}

function getFirstName(name) {
  return String(name || '').split(' ')[0]
}

function getNextWorkoutDay(plan) {
  if (!plan?.days?.length) return 'No hay rutina asignada'
  return plan.days.find((day) => day.status !== 'Completado')?.name || plan.days[0].name
}

function WeightChart({ logs }) {
  if (!logs?.length) {
    return <p className="rounded-2xl bg-slate-950/30 p-6 text-center text-sm text-slate-400">No hay registros de peso.</p>
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={logs}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#fff' }} />
          <Line type="monotone" dataKey="weight" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function AppShortcutCard({ title, description, Icon, indicator, onClick, tone = 'green' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="nutricore-shortcut group rounded-[1.65rem] p-4 text-left transition duration-200 hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cx('nutricore-icon-bubble', tone === 'cyan' && 'nutricore-icon-cyan', tone === 'amber' && 'nutricore-icon-amber')}>
          <Icon size={26} />
        </span>
        {indicator && <span className="nutricore-pill text-[11px] font-black">{indicator}</span>}
      </div>
      <h3 className="mt-4 text-lg font-black text-[var(--nc-text)]">{title}</h3>
      <p className="mt-1 text-sm leading-5 text-[var(--nc-muted)]">{description}</p>
    </button>
  )
}

function MetricCard({ label, value, Icon, tone = 'green' }) {
  return (
    <div className="nutricore-metric rounded-[1.4rem] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className={cx('nutricore-mini-icon', tone === 'cyan' && 'nutricore-icon-cyan', tone === 'amber' && 'nutricore-icon-amber')}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--nc-muted)]">{label}</p>
      <p className="mt-1 text-lg font-black text-[var(--nc-text)]">{value}</p>
    </div>
  )
}

function MealOption({ option }) {
  return (
    <div className="rounded-2xl bg-slate-950/35 p-4 transition hover:-translate-y-0.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-black text-white">{option.name}</h4>
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          <Badge tone="green">{Math.round(option.totals.kcal)} kcal</Badge>
          <Badge>{Math.round(option.totals.protein)} P</Badge>
          <Badge>{Math.round(option.totals.carbs)} C</Badge>
          <Badge>{Math.round(option.totals.fat)} G</Badge>
        </div>
      </div>
      <div className="mt-3 grid gap-2">
        {option.foods.map((item) => (
          <div key={`${option.name}-${item.name}`} className="flex flex-col justify-between gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm sm:flex-row sm:items-center">
            <span className="font-semibold text-slate-100">{item.quantity} {item.unit} {item.name}</span>
            <span className="inline-flex w-fit rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-xs font-black text-emerald-100">{item.prep}</span>
            <span className="text-xs text-slate-400">{item.kcal} kcal · {item.protein}p/{item.carbs}c/{item.fat}g</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DietView({ plan }) {
  if (!plan) return <Card><p className="text-slate-300">No hay dieta asignada todavía.</p></Card>

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-white">{plan.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{plan.target} · {plan.kcal} kcal aproximadas</p>
          </div>
          <Badge tone="cyan">Solo editable por admin</Badge>
        </div>
      </Card>
      {plan.meals.map((meal) => (
        <Card key={meal.id}>
          <h3 className="text-xl font-black text-white">{meal.name}</h3>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {meal.options.map((option) => <MealOption key={option.name} option={option} />)}
          </div>
        </Card>
      ))}
    </div>
  )
}

function WorkoutView({ plan, onUpdatePlan }) {
  if (!plan) return <Card><p className="text-slate-300">No hay rutina asignada todavía.</p></Card>

  function updateDayStatus(dayId, status) {
    onUpdatePlan({
      ...plan,
      days: plan.days.map((day) => (day.id === dayId ? { ...day, status } : day)),
    })
  }

  return (
    <div className="grid gap-4">
      <Card>
        <h2 className="text-2xl font-black text-white">{plan.name}</h2>
        <p className="mt-2 text-sm text-emerald-100">Completa los días en orden, sin importar el día de la semana.</p>
        <p className="mt-1 text-sm text-slate-400">Próxima sesión recomendada: {getNextWorkoutDay(plan)}</p>
      </Card>
      {plan.days.map((day) => (
        <Card key={day.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-white">{day.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{day.muscles} · {day.duration} · {day.difficulty}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={day.status === 'Completado' ? 'green' : day.status === 'Saltado' ? 'amber' : 'slate'}>{day.status}</Badge>
              <select value={day.status} onChange={(event) => updateDayStatus(day.id, event.target.value)} className="nutricore-input rounded-xl px-3 py-2 text-sm">
                <option>Pendiente</option>
                <option>Completado</option>
                <option>Saltado</option>
              </select>
              {day.status !== 'Completado' && (
                <button type="button" onClick={() => updateDayStatus(day.id, 'Completado')} className="rounded-xl bg-emerald-300 px-3 py-2 text-sm font-black text-slate-950 transition active:scale-95">
                  Marcar completado
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {day.exercises.map((exercise) => (
              <div key={exercise.name} className="rounded-2xl bg-slate-950/35 p-4">
                <h4 className="font-black text-white">{exercise.name}</h4>
                <p className="mt-1 text-sm text-slate-400">{exercise.muscle}</p>
                <p className="mt-3 text-sm font-semibold text-emerald-100">{exercise.sets} series x {exercise.reps} · Descanso: {exercise.rest}</p>
                {exercise.rir && <p className="mt-1 text-xs text-slate-400">{exercise.rir}</p>}
                <p className="mt-2 text-sm leading-6 text-slate-300">{exercise.notes}</p>
                {exercise.alternative && <p className="mt-2 text-xs text-slate-400">Alternativa: {exercise.alternative}</p>}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

function UserDashboard({ user, mealPlan, workoutPlan, logs, onNavigate }) {
  const stats = weightStats(logs)
  const nextWorkout = getNextWorkoutDay(workoutPlan)
  const metrics = [
    ['Peso actual', `${user.weight} kg`, Activity, 'green'],
    ['Cambio total', `${stats.diff > 0 ? '+' : ''}${stats.diff} kg`, LineChartIcon, 'cyan'],
    ['Siguiente sesión', nextWorkout, Dumbbell, 'amber'],
    ['Dieta asignada', mealPlan?.name || 'Sin asignar', Apple, 'green'],
  ]
  const shortcuts = [
    ['Perfil', 'Actualiza tus datos y peso actual', UserRound, 'Editar', 'Perfil', 'green'],
    ['Dieta', 'Consulta tus 5 comidas del día', Apple, `${mealPlan?.meals?.length || 0} comidas`, 'Dieta', 'cyan'],
    ['Entrenamiento', `Siguiente sesión: ${nextWorkout}`, Dumbbell, 'Pendiente', 'Entrenamiento', 'amber'],
    ['Progreso', 'Revisa tu evolución de peso', BarChart3, `${logs.length} registros`, 'Progreso', 'green'],
    ['Coach notes', 'Lee la última nota del admin', ClipboardList, 'Nueva', 'Perfil', 'cyan'],
    ['Resumen', 'Objetivo, adherencia y estado general', Settings, '82%', 'Progreso', 'amber'],
  ]

  return (
    <div className="grid gap-4">
      <Card className="nutricore-hero-card overflow-hidden">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--nc-accent)]">Inicio</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--nc-text)]">Hola, {getFirstName(user.name)}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--nc-muted)]">Listo para continuar tu plan. Tu objetivo actual es {user.goal.toLowerCase()}.</p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-emerald-400 text-2xl font-black text-emerald-950 shadow-lg shadow-emerald-500/20">
            {getFirstName(user.name).slice(0, 1)}
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, Icon, tone]) => (
          <MetricCard key={label} label={label} value={value} Icon={Icon} tone={tone} />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shortcuts.map(([title, description, Icon, indicator, target, tone]) => (
          <AppShortcutCard
            key={title}
            title={title}
            description={description}
            Icon={Icon}
            indicator={indicator}
            tone={tone}
            onClick={() => onNavigate(target)}
          />
        ))}
      </div>

      <Card className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--nc-accent)]">Coach note</p>
          <h2 className="mt-2 text-xl font-black text-[var(--nc-text)]">Siguiente acción recomendada</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--nc-muted)]">{user.adminNote}</p>
        </div>
        <div className="nutricore-progress-card rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--nc-muted)]">Adherencia semanal</span>
            <span className="text-2xl font-black text-[var(--nc-text)]">82%</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div className="h-full w-[82%] rounded-full bg-emerald-400" />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-black text-[var(--nc-text)]">Evolución rápida</h2>
        <WeightChart logs={logs} />
      </Card>
    </div>
  )
}

function ProfileView({ user, logs, onSave, onAddWeight }) {
  const [form, setForm] = useState(user)
  const [weight, setWeight] = useState(user.weight)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => setForm(user), [user])

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <h2 className="text-2xl font-black text-white">Perfil</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            ['name', 'Nombre'],
            ['age', 'Edad'],
            ['height', 'Altura'],
            ['weight', 'Peso actual'],
            ['goal', 'Objetivo'],
            ['activity', 'Nivel de actividad'],
            ['preferences', 'Preferencias alimentarias'],
            ['allergies', 'Alergias'],
            ['injuries', 'Lesiones'],
          ].map(([field, label]) => (
            <Field key={field} label={label} value={form[field]} onChange={(value) => setForm((current) => ({ ...current, [field]: field === 'age' || field === 'height' || field === 'weight' ? Number(value) : value }))} />
          ))}
        </div>
        <label className="mt-4 grid gap-1.5 text-sm font-semibold text-slate-200">
          Notas personales
          <textarea value={form.personalNotes || ''} onChange={(event) => setForm((current) => ({ ...current, personalNotes: event.target.value }))} className="min-h-28 rounded-xl border border-white/10 bg-slate-950/40 p-3 text-sm text-white outline-none focus:border-emerald-300" />
        </label>
        <button onClick={() => onSave(form)} className="mt-5 rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-black text-slate-950">Guardar perfil</button>
      </Card>
      <Card>
        <h2 className="text-2xl font-black text-white">Registrar peso</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Fecha" type="date" value={date} onChange={setDate} />
          <Field label="Peso" type="number" value={weight} onChange={setWeight} />
          <button onClick={() => onAddWeight({ date, weight: Number(weight) })} className="rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-black text-slate-950">Añadir registro</button>
        </div>
        <div className="mt-6 max-h-80 overflow-y-auto">
          {logs.map((log) => <p key={`${log.date}-${log.weight}`} className="border-b border-white/10 py-2 text-sm text-slate-300">{log.date} · {log.weight} kg</p>)}
        </div>
      </Card>
    </div>
  )
}

function ProgressView({ logs }) {
  const stats = weightStats(logs)
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Card><p className="text-sm text-slate-400">Peso inicial</p><p className="mt-1 text-2xl font-black text-white">{stats.initial} kg</p></Card>
        <Card><p className="text-sm text-slate-400">Peso actual</p><p className="mt-1 text-2xl font-black text-white">{stats.current} kg</p></Card>
        <Card><p className="text-sm text-slate-400">Diferencia total</p><p className="mt-1 text-2xl font-black text-white">{stats.diff} kg</p></Card>
        <Card><p className="text-sm text-slate-400">Mejor cambio semanal</p><p className="mt-1 text-2xl font-black text-white">{stats.bestWeekly} kg</p></Card>
      </div>
      <Card><WeightChart logs={logs} /></Card>
      <Card>
        <h2 className="text-xl font-black text-white">Registros de peso</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {logs.map((log) => <p key={`${log.date}-${log.weight}`} className="rounded-xl bg-slate-950/35 px-3 py-2 text-sm text-slate-300">{log.date} · {log.weight} kg</p>)}
        </div>
      </Card>
    </div>
  )
}

function AdminDashboard({ state, onCreateUser, onCreateDiet, onCreateWorkout, onOpenTab }) {
  const usersWithDiet = state.users.filter((user) => user.dietId).length
  const usersWithWorkout = state.users.filter((user) => user.workoutId).length
  const cards = [
    ['Total de usuarios', state.users.length, Users],
    ['Usuarios activos', state.users.length, Activity],
    ['Dietas creadas', state.mealPlans.length, Apple],
    ['Rutinas creadas', state.workoutPlans.length, Dumbbell],
    ['Con dieta asignada', usersWithDiet, ShieldCheck],
    ['Con rutina asignada', usersWithWorkout, ShieldCheck],
  ]
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, Icon]) => (
          <Card key={label}><Icon className="text-emerald-200" /><p className="mt-3 text-sm text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-white">{value}</p></Card>
        ))}
      </div>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-white">Accesos rápidos</h2>
          <Badge tone="cyan">Admin tools</Badge>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          <button onClick={onCreateUser} className="rounded-xl bg-emerald-300 px-3 py-2 text-sm font-black text-slate-950">Crear usuario</button>
          <button onClick={onCreateDiet} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white">Crear dieta</button>
          <button onClick={onCreateWorkout} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white">Crear rutina</button>
          <button onClick={() => onOpenTab('Usuarios')} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white">Ver usuarios</button>
        </div>
      </Card>
      <Card>
        <h2 className="text-xl font-black text-white">Últimos cambios</h2>
        <div className="mt-3 grid gap-2">
          {state.changes.map((change) => <p key={change} className="rounded-xl bg-slate-950/35 px-3 py-2 text-sm text-slate-300">{change}</p>)}
        </div>
      </Card>
    </div>
  )
}

function AdminUsers({ state, selectedUserId, onSelectUser, onSaveUser, onCreateUser, onDeleteUser }) {
  const [query, setQuery] = useState('')
  const [goal, setGoal] = useState('All')
  const [level, setLevel] = useState('All')
  const selectedUser = state.users.find((user) => user.id === selectedUserId)
  const filteredUsers = state.users.filter((user) => {
    const matchesQuery = user.name.toLowerCase().includes(query.toLowerCase())
    const matchesGoal = goal === 'All' || user.goal === goal
    const matchesLevel = level === 'All' || user.level === level
    return matchesQuery && matchesGoal && matchesLevel
  })

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white">Usuarios</h2>
            <p className="mt-1 text-sm text-slate-400">Gestiona perfiles, dietas asignadas, rutinas y notas internas.</p>
          </div>
          <button onClick={onCreateUser} className="inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-3 py-2 text-sm font-black text-slate-950"><Plus size={15} /> Crear usuario</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="relative sm:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-3 text-slate-500" size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuario" className="min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/40 pl-9 pr-3 text-sm text-white outline-none" />
          </label>
          <SelectField label="Objetivo" value={goal} onChange={setGoal}>
            <option>All</option>
            {[...new Set(state.users.map((user) => user.goal))].map((item) => <option key={item}>{item}</option>)}
          </SelectField>
          <SelectField label="Nivel" value={level} onChange={setLevel}>
            <option>All</option>
            {[...new Set(state.users.map((user) => user.level))].map((item) => <option key={item}>{item}</option>)}
          </SelectField>
        </div>
        <div className="mt-4 grid gap-3">
          {filteredUsers.map((user) => (
            <button key={user.id} onClick={() => onSelectUser(user.id)} className={cx('rounded-2xl border p-4 text-left transition', user.id === selectedUserId ? 'border-emerald-300 bg-emerald-300/10' : 'border-white/10 bg-slate-950/30 hover:border-white/20')}>
              <p className="font-black text-white">{user.name}</p>
              <p className="mt-1 text-sm text-slate-400">{user.goal} · {user.level}</p>
            </button>
          ))}
        </div>
      </Card>
      {selectedUser && (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-white">Detalle de usuario</h2>
              <p className="mt-1 text-sm text-slate-400">Los cambios se guardan en localStorage para esta demo.</p>
            </div>
            <button
              onClick={() => window.confirm('Eliminar este usuario demo?') && onDeleteUser(selectedUser.id)}
              className="rounded-xl border border-red-400/30 px-3 py-2 text-sm font-bold text-red-100"
            >
              Eliminar
            </button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" value={selectedUser.name} onChange={(value) => onSaveUser(selectedUser.id, { name: value })} />
            <Field label="Edad" type="number" value={selectedUser.age} onChange={(value) => onSaveUser(selectedUser.id, { age: Number(value) })} />
            <Field label="Altura" type="number" value={selectedUser.height} onChange={(value) => onSaveUser(selectedUser.id, { height: Number(value) })} />
            <Field label="Peso actual" type="number" value={selectedUser.weight} onChange={(value) => onSaveUser(selectedUser.id, { weight: Number(value) })} />
            <Field label="Objetivo" value={selectedUser.goal} onChange={(value) => onSaveUser(selectedUser.id, { goal: value })} />
            <Field label="Nivel" value={selectedUser.level} onChange={(value) => onSaveUser(selectedUser.id, { level: value })} />
            <Field label="Actividad" value={selectedUser.activity} onChange={(value) => onSaveUser(selectedUser.id, { activity: value })} />
            <Field label="Alergias" value={selectedUser.allergies} onChange={(value) => onSaveUser(selectedUser.id, { allergies: value })} />
            <Field label="Lesiones" value={selectedUser.injuries} onChange={(value) => onSaveUser(selectedUser.id, { injuries: value })} />
            <Field label="Preferencias" value={selectedUser.preferences} onChange={(value) => onSaveUser(selectedUser.id, { preferences: value })} />
            <SelectField label="Dieta asignada" value={selectedUser.dietId} onChange={(value) => onSaveUser(selectedUser.id, { dietId: value })}>
              {state.mealPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
            </SelectField>
            <SelectField label="Rutina asignada" value={selectedUser.workoutId} onChange={(value) => onSaveUser(selectedUser.id, { workoutId: value })}>
              {state.workoutPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
            </SelectField>
          </div>
          <label className="mt-4 grid gap-1.5 text-sm font-semibold text-slate-200">
            Nota del admin
            <textarea value={selectedUser.adminNote} onChange={(event) => onSaveUser(selectedUser.id, { adminNote: event.target.value })} className="min-h-24 rounded-xl border border-white/10 bg-slate-950/40 p-3 text-sm text-white outline-none" />
          </label>
        </Card>
      )}
    </div>
  )
}

function MealPlanEditor({ state, onSavePlan, onCreatePlan, onDuplicatePlan, onDeletePlan }) {
  const [selectedPlanId, setSelectedPlanId] = useState(state.mealPlans[0]?.id)
  const plan = state.mealPlans.find((item) => item.id === selectedPlanId)

  useEffect(() => {
    if (!state.mealPlans.some((item) => item.id === selectedPlanId)) {
      setSelectedPlanId(state.mealPlans[0]?.id)
    }
  }, [state.mealPlans, selectedPlanId])

  if (!plan) return null

  function updateFood(mealId, optionName, foodIndex, patch) {
    onSavePlan(plan.id, {
      meals: plan.meals.map((meal) => meal.id !== mealId ? meal : {
        ...meal,
        options: meal.options.map((option) => option.name !== optionName ? option : {
          ...option,
          foods: option.foods.map((foodItem, index) => index === foodIndex ? { ...foodItem, ...patch } : foodItem),
        }),
      }),
    })
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SelectField label="Plantilla" value={selectedPlanId} onChange={setSelectedPlanId}>
            {state.mealPlans.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </SelectField>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedPlanId(onCreatePlan())} className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 px-3 py-2 text-sm font-bold text-emerald-100"><Plus size={15} /> Nueva</button>
            <button onClick={() => setSelectedPlanId(onDuplicatePlan(plan.id))} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white">Duplicar</button>
            <button
              onClick={() => window.confirm('Eliminar esta dieta demo? Los usuarios asignados pasaran a otra plantilla.') && onDeletePlan(plan.id)}
              className="rounded-xl border border-red-400/30 px-3 py-2 text-sm font-bold text-red-100"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Card>
      {plan.meals.map((meal) => (
        <Card key={meal.id}>
          <h3 className="text-xl font-black text-white">{meal.name}</h3>
          <div className="mt-4 grid gap-3">
            {meal.options.map((option) => (
              <div key={option.name} className="rounded-2xl bg-slate-950/35 p-4">
                <h4 className="font-black text-white">{option.name}</h4>
                <div className="mt-3 grid gap-2">
                  {option.foods.map((foodItem, index) => (
                    <div key={`${foodItem.name}-${index}`} className="grid gap-2 rounded-xl border border-white/10 p-3 md:grid-cols-4">
                      <Field label="Alimento" value={foodItem.name} onChange={(value) => updateFood(meal.id, option.name, index, { name: value })} />
                      <Field label="Cantidad" type="number" value={foodItem.quantity} onChange={(value) => updateFood(meal.id, option.name, index, { quantity: Number(value) })} />
                      <Field label="Unidad" value={foodItem.unit} onChange={(value) => updateFood(meal.id, option.name, index, { unit: value })} />
                      <SelectField label="Estado" value={foodItem.prep} onChange={(value) => updateFood(meal.id, option.name, index, { prep: value })}>
                        {['en crudo', 'cocido', 'seco', 'escurrido', 'al natural', 'preparado', 'opcional / no aplica'].map((item) => <option key={item}>{item}</option>)}
                      </SelectField>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

function WorkoutPlanEditor({ state, onSavePlan, onCreatePlan, onDuplicatePlan, onDeletePlan }) {
  const [selectedPlanId, setSelectedPlanId] = useState(state.workoutPlans[0]?.id)
  const plan = state.workoutPlans.find((item) => item.id === selectedPlanId)

  useEffect(() => {
    if (!state.workoutPlans.some((item) => item.id === selectedPlanId)) {
      setSelectedPlanId(state.workoutPlans[0]?.id)
    }
  }, [state.workoutPlans, selectedPlanId])

  if (!plan) return null

  function updateExercise(dayId, exerciseIndex, patch) {
    onSavePlan(plan.id, {
      days: plan.days.map((dayItem) => dayItem.id !== dayId ? dayItem : {
        ...dayItem,
        exercises: dayItem.exercises.map((exerciseItem, index) => index === exerciseIndex ? { ...exerciseItem, ...patch } : exerciseItem),
      }),
    })
  }

  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SelectField label="Rutina" value={selectedPlanId} onChange={setSelectedPlanId}>
            {state.workoutPlans.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </SelectField>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedPlanId(onCreatePlan())} className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 px-3 py-2 text-sm font-bold text-emerald-100"><Plus size={15} /> Nueva</button>
            <button onClick={() => setSelectedPlanId(onDuplicatePlan(plan.id))} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white">Duplicar</button>
            <button
              onClick={() => window.confirm('Eliminar esta rutina demo? Los usuarios asignados pasaran a otra plantilla.') && onDeletePlan(plan.id)}
              className="rounded-xl border border-red-400/30 px-3 py-2 text-sm font-bold text-red-100"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Card>
      {plan.days.map((dayItem) => (
        <Card key={dayItem.id}>
          <h3 className="text-xl font-black text-white">{dayItem.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{dayItem.muscles} · {dayItem.duration}</p>
          <div className="mt-4 grid gap-3">
            {dayItem.exercises.map((exerciseItem, index) => (
              <div key={`${exerciseItem.name}-${index}`} className="grid gap-2 rounded-xl border border-white/10 p-3 md:grid-cols-4">
                <Field label="Ejercicio" value={exerciseItem.name} onChange={(value) => updateExercise(dayItem.id, index, { name: value })} />
                <Field label="Series" type="number" value={exerciseItem.sets} onChange={(value) => updateExercise(dayItem.id, index, { sets: Number(value) })} />
                <Field label="Repeticiones" value={exerciseItem.reps} onChange={(value) => updateExercise(dayItem.id, index, { reps: value })} />
                <Field label="Descanso" value={exerciseItem.rest} onChange={(value) => updateExercise(dayItem.id, index, { rest: value })} />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

function TemplatesView({ state }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="text-xl font-black text-white">Plantillas de dieta</h2>
        <div className="mt-3 grid gap-2">{state.mealPlans.map((plan) => <p key={plan.id} className="rounded-xl bg-slate-950/35 px-3 py-2 text-sm text-slate-300">{plan.name} · {plan.kcal} kcal</p>)}</div>
      </Card>
      <Card>
        <h2 className="text-xl font-black text-white">Plantillas de rutina</h2>
        <div className="mt-3 grid gap-2">{state.workoutPlans.map((plan) => <p key={plan.id} className="rounded-xl bg-slate-950/35 px-3 py-2 text-sm text-slate-300">{plan.name} · {plan.days.length} días</p>)}</div>
      </Card>
    </div>
  )
}

function NutriCore() {
  usePageTitle('NutriCore | Nutrition and Training Platform')
  const [state, setState] = useState(loadNutriCoreState)
  const [role, setRole] = useState('user')
  const [selectedUserId, setSelectedUserId] = useState(state.users[0]?.id)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [theme, setTheme] = useState(() => localStorage.getItem('nutricore-theme') || 'dark')
  const [toast, setToast] = useState('')

  useEffect(() => {
    saveNutriCoreState(state)
  }, [state])

  useEffect(() => {
    localStorage.setItem('nutricore-theme', theme)
  }, [theme])

  const selectedUser = state.users.find((user) => user.id === selectedUserId) || state.users[0]
  const selectedMealPlan = state.mealPlans.find((plan) => plan.id === selectedUser?.dietId)
  const selectedWorkoutPlan = state.workoutPlans.find((plan) => plan.id === selectedUser?.workoutId)
  const selectedLogs = state.weightLogs[selectedUser?.id] || []

  function applyState(nextState, message) {
    setState(nextState)
    setToast(message)
    window.setTimeout(() => setToast(''), 1800)
  }

  function saveUserPatch(userId, patch) {
    applyState(updateUser(state, userId, patch), 'Usuario guardado')
  }

  function handleCreateUser() {
    const result = createUser(state)
    setSelectedUserId(result.id)
    setActiveTab('Usuarios')
    applyState(result.state, 'Usuario creado correctamente')
  }

  function handleDeleteUser(userId) {
    const nextState = deleteUser(state, userId)
    const fallbackUser = nextState.users[0]
    if (selectedUserId === userId && fallbackUser) {
      setSelectedUserId(fallbackUser.id)
    }
    applyState(nextState, 'Usuario eliminado correctamente')
  }

  function saveMealPlan(planId, patch) {
    applyState(updateMealPlan(state, planId, patch), 'Dieta actualizada correctamente')
  }

  function saveWorkoutPlan(planId, patch) {
    applyState(updateWorkoutPlan(state, planId, patch), 'Rutina actualizada correctamente')
  }

  function handleCreateMealPlan() {
    const result = createMealPlan(state)
    applyState(result.state, 'Dieta creada correctamente')
    return result.id
  }

  function handleDuplicateMealPlan(planId) {
    const result = duplicateMealPlan(state, planId)
    applyState(result.state, 'Dieta duplicada correctamente')
    return result.id
  }

  function handleDeleteMealPlan(planId) {
    applyState(deleteMealPlan(state, planId), 'Dieta eliminada correctamente')
  }

  function handleCreateWorkoutPlan() {
    const result = createWorkoutPlan(state)
    applyState(result.state, 'Rutina creada correctamente')
    return result.id
  }

  function handleDuplicateWorkoutPlan(planId) {
    const result = duplicateWorkoutPlan(state, planId)
    applyState(result.state, 'Rutina duplicada correctamente')
    return result.id
  }

  function handleDeleteWorkoutPlan(planId) {
    applyState(deleteWorkoutPlan(state, planId), 'Rutina eliminada correctamente')
  }

  function renderUserView() {
    if (activeTab === 'Dashboard') return <UserDashboard user={selectedUser} mealPlan={selectedMealPlan} workoutPlan={selectedWorkoutPlan} logs={selectedLogs} onNavigate={setActiveTab} />
    if (activeTab === 'Perfil') return <ProfileView user={selectedUser} logs={selectedLogs} onSave={(form) => saveUserPatch(selectedUser.id, form)} onAddWeight={(log) => applyState(addWeightLog(state, selectedUser.id, log), 'Peso registrado')} />
    if (activeTab === 'Dieta') return <DietView plan={selectedMealPlan} />
    if (activeTab === 'Entrenamiento') return <WorkoutView plan={selectedWorkoutPlan} onUpdatePlan={(plan) => saveWorkoutPlan(plan.id, plan)} />
    return <ProgressView logs={selectedLogs} />
  }

  function renderAdminView() {
    if (activeTab === 'Admin Dashboard') {
      return (
        <AdminDashboard
          state={state}
          onCreateUser={handleCreateUser}
          onCreateDiet={() => { const id = handleCreateMealPlan(); setActiveTab('Editor de dieta'); return id }}
          onCreateWorkout={() => { const id = handleCreateWorkoutPlan(); setActiveTab('Editor de rutina'); return id }}
          onOpenTab={setActiveTab}
        />
      )
    }
    if (activeTab === 'Usuarios') return <AdminUsers state={state} selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} onSaveUser={saveUserPatch} onCreateUser={handleCreateUser} onDeleteUser={handleDeleteUser} />
    if (activeTab === 'Editor de dieta') return <MealPlanEditor state={state} onSavePlan={saveMealPlan} onCreatePlan={handleCreateMealPlan} onDuplicatePlan={handleDuplicateMealPlan} onDeletePlan={handleDeleteMealPlan} />
    if (activeTab === 'Editor de rutina') return <WorkoutPlanEditor state={state} onSavePlan={saveWorkoutPlan} onCreatePlan={handleCreateWorkoutPlan} onDuplicatePlan={handleDuplicateWorkoutPlan} onDeletePlan={handleDeleteWorkoutPlan} />
    return <TemplatesView state={state} />
  }

  const tabs = role === 'user' ? userTabs : adminTabs
  const tabMeta = role === 'user' ? userTabMeta : adminTabMeta

  return (
    <main data-theme={theme} className="nutricore-app min-h-screen text-[var(--nc-text)]">
      <div className="mx-auto flex min-h-screen max-w-[96rem] flex-col px-4 py-5 sm:px-6">
        <header className="nutricore-topbar grid gap-4 rounded-[2rem] p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--nc-accent)]">Nutrition & Training SaaS Demo</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[var(--nc-text)] sm:text-5xl">NutriCore</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--nc-muted)]">Personalized nutrition and training platform with user and admin views, structured meal plans, flexible workout days and localStorage persistence.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] lg:min-w-[32rem]">
            <SelectField label="Demo user" value={selectedUserId} onChange={setSelectedUserId}>
              {state.users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
            </SelectField>
            <SelectField label="Role view" value={role} onChange={(value) => { setRole(value); setActiveTab(value === 'user' ? 'Dashboard' : 'Admin Dashboard') }}>
              <option value="user">Vista usuario</option>
              <option value="admin">Vista administrador</option>
            </SelectField>
            <button
              type="button"
              onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
              className="nutricore-theme-toggle mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>

        <div className="mt-5 grid flex-1 gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="nutricore-sidebar hidden rounded-[2rem] p-4 lg:block">
            <nav className="grid gap-2">
              {tabs.map((tab) => {
                const Icon = tabMeta[tab]?.icon || Sparkles
                return (
                <button key={tab} onClick={() => setActiveTab(tab)} className={cx('nutricore-nav-item flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold transition', activeTab === tab && 'is-active')}>
                  <Icon size={18} />
                  <span>{tabMeta[tab]?.label || tab}</span>
                </button>
              )})}
            </nav>
            <button onClick={() => applyState(resetNutriCoreState(), 'Demo reiniciada')} className="nutricore-ghost-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold">
              <RotateCcw size={16} /> Reset demo
            </button>
          </aside>

          <section className="min-w-0 pb-24 lg:pb-0">
            {toast && <p className="nutricore-toast mb-4 rounded-2xl px-4 py-3 text-sm font-bold">{toast}</p>}
            {role === 'user' ? renderUserView() : renderAdminView()}
          </section>
        </div>

        <nav className="nutricore-bottom-nav fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-3xl p-2 lg:hidden">
          {tabs.slice(0, 5).map((tab) => {
            const Icon = tabMeta[tab]?.icon || Sparkles
            return (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cx('flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black transition active:scale-95', activeTab === tab && 'is-active')}>
              <Icon size={18} />
              <span>{tabMeta[tab]?.label || tab.replace('Admin ', '')}</span>
            </button>
          )})}
        </nav>
      </div>
    </main>
  )
}

export default NutriCore
