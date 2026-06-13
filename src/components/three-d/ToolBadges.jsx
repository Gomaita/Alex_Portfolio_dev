const toolDefinitions = [
  {
    key: 'blender',
    label: 'Blender',
    aliases: ['blender'],
    className: 'from-orange-400/20 to-orange-500/5 text-orange-200 border-orange-300/20',
    Icon: BlenderGlyph,
  },
  {
    key: 'unity',
    label: 'Unity',
    aliases: ['unity'],
    className: 'from-zinc-200/15 to-zinc-500/5 text-zinc-100 border-zinc-300/20',
    Icon: UnityGlyph,
  },
  {
    key: 'unreal',
    label: 'Unreal Engine',
    aliases: ['unreal', 'unreal engine', 'ue5', 'ue4'],
    className: 'from-sky-400/20 to-cyan-500/5 text-sky-100 border-sky-300/20',
    Icon: UnrealGlyph,
  },
  {
    key: 'substance-painter',
    label: 'Substance Painter',
    aliases: ['substance painter', 'substance 3d painter', 'painter'],
    className: 'from-red-400/20 to-rose-500/5 text-rose-100 border-rose-300/20',
    Icon: PainterGlyph,
  },
  {
    key: 'substance-designer',
    label: 'Substance Designer',
    aliases: ['substance designer', 'substance 3d designer', 'designer'],
    className: 'from-amber-300/20 to-yellow-500/5 text-amber-100 border-amber-300/20',
    Icon: DesignerGlyph,
  },
  {
    key: 'marmoset',
    label: 'Marmoset Toolbag',
    aliases: ['marmoset', 'marmoset toolbag', 'toolbag'],
    className: 'from-teal-300/20 to-emerald-500/5 text-teal-100 border-teal-300/20',
    Icon: MarmosetGlyph,
  },
  {
    key: 'zbrush',
    label: 'ZBrush',
    aliases: ['zbrush', 'z brush'],
    className: 'from-purple-400/20 to-fuchsia-500/5 text-purple-100 border-purple-300/20',
    Icon: ZBrushGlyph,
  },
  {
    key: 'maya',
    label: 'Maya',
    aliases: ['maya', 'autodesk maya'],
    className: 'from-cyan-300/20 to-blue-500/5 text-cyan-100 border-cyan-300/20',
    Icon: MayaGlyph,
  },
  {
    key: '3ds-max',
    label: '3ds Max',
    aliases: ['3ds max', '3dsmax', 'autodesk 3ds max'],
    className: 'from-lime-300/20 to-green-500/5 text-lime-100 border-lime-300/20',
    Icon: MaxGlyph,
  },
]

const skillNames = new Set([
  'modeling',
  'sculpting',
  'retopology',
  'uv mapping',
  'uvs',
  'baking',
  'pbr texturing',
  'procedural texturing',
  'procedural materials',
  'lighting',
  'rendering',
  'shader creation',
  'game ready optimization',
  'real-time optimization',
  'engine presentation',
  'set dressing',
])

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function getToolDefinition(value) {
  const normalized = normalize(value)
  return toolDefinitions.find((definition) => definition.aliases.some((alias) => normalize(alias) === normalized))
}

export function splitSoftwareAndSkills(items = []) {
  const unique = [...new Set(items.filter(Boolean))]
  const software = []
  const skills = []

  unique.forEach((item) => {
    const definition = getToolDefinition(item)
    if (definition) {
      if (!software.some((tool) => tool.key === definition.key)) software.push(definition)
      return
    }
    if (skillNames.has(normalize(item)) || !definition) skills.push(item)
  })

  return { software, skills: [...new Set(skills)] }
}

export function ToolBadge({ tool }) {
  const definition = typeof tool === 'string' ? getToolDefinition(tool) : tool
  const Icon = definition?.Icon || FallbackGlyph
  const label = definition?.label || String(tool || 'Tool')
  const className = definition?.className || 'from-white/10 to-white/5 text-zinc-200 border-white/10'

  return (
    <div className={`group flex items-center gap-3 rounded-2xl border bg-gradient-to-br px-3 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#13aff0]/40 ${className}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/25 ring-1 ring-white/10">
        <Icon />
      </span>
      <span className="min-w-0 text-sm font-black">{label}</span>
    </div>
  )
}

export function ToolBadgeGrid({ tools = [] }) {
  const { software } = splitSoftwareAndSkills(tools)
  const fallbackTools = tools.filter((tool) => !getToolDefinition(tool))
  const items = software.length ? software : fallbackTools
  if (!items.length) return <p className="text-sm text-zinc-500">Not specified yet.</p>

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((tool) => (
        <ToolBadge key={typeof tool === 'string' ? tool : tool.key} tool={tool} />
      ))}
    </div>
  )
}

export function SkillChipList({ items = [] }) {
  const cleanItems = [...new Set(items.filter(Boolean))]
  if (!cleanItems.length) return <p className="text-sm text-zinc-500">Not specified yet.</p>

  return (
    <div className="flex flex-wrap gap-2">
      {cleanItems.map((item) => (
        <span key={item} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs font-bold text-zinc-300">
          {item}
        </span>
      ))}
    </div>
  )
}

function IconSvg({ children }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

function BlenderGlyph() {
  return <IconSvg><path d="M9 17h9a5 5 0 1 1-2-4" /><path d="M4 12h11l-5-5" /><path d="M8 22l5-5" /><circle cx="20" cy="17" r="2.4" /></IconSvg>
}

function UnityGlyph() {
  return <IconSvg><path d="M16 4 27 10v12l-11 6-11-6V10z" /><path d="M16 4v9l8 4.5" /><path d="M5 10l8 4.5V24" /><path d="M27 10l-8 4.5V24" /></IconSvg>
}

function UnrealGlyph() {
  return <IconSvg><path d="M7 8c3-3 15-3 18 0" /><path d="M9 8v10c0 5 3 8 7 8s7-3 7-8V8" /><path d="M13 11v8c0 2 1 3 3 3s3-1 3-3v-8" /></IconSvg>
}

function PainterGlyph() {
  return <IconSvg><path d="M6 23c5-10 9-15 18-15" /><path d="M19 8l5 5" /><path d="M7 24c2 2 6 2 8-1" /><path d="M11 20l5 5" /></IconSvg>
}

function DesignerGlyph() {
  return <IconSvg><rect x="5" y="5" width="9" height="9" rx="2" /><rect x="18" y="5" width="9" height="9" rx="2" /><rect x="5" y="18" width="9" height="9" rx="2" /><path d="M18 22h9" /><path d="M22.5 18v9" /></IconSvg>
}

function MarmosetGlyph() {
  return <IconSvg><path d="M6 22c4-12 15-16 20-13-1 10-7 17-16 17" /><path d="M10 19c4 0 8-2 12-7" /><path d="M8 25c3-1 5-3 7-6" /></IconSvg>
}

function ZBrushGlyph() {
  return <IconSvg><path d="M8 8h16L10 24h14" /><path d="M7 24c5-2 8-4 10-8" /><path d="M18 8c-3 5-5 8-9 11" /></IconSvg>
}

function MayaGlyph() {
  return <IconSvg><path d="M5 24V8l11 11L27 8v16" /><path d="M10 13v11" /><path d="M22 13v11" /></IconSvg>
}

function MaxGlyph() {
  return <IconSvg><path d="M6 9h20" /><path d="M9 16h14" /><path d="M6 23h20" /><path d="M11 9l10 14" /><path d="M21 9 11 23" /></IconSvg>
}

function FallbackGlyph() {
  return <IconSvg><path d="M8 8h16v16H8z" /><path d="M12 20 20 12" /><path d="M13 12h7v7" /></IconSvg>
}
