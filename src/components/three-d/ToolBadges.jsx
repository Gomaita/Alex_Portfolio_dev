import MaxIcon from '../../assets/3dsMax_PNG.png'
import BlenderIcon from '../../assets/Blender_PNG.png'
import MarmosetIcon from '../../assets/Marmoset_PNG.png'
import MayaIcon from '../../assets/Maya_PNG.png'
import PhotoshopIcon from '../../assets/Photoshop_PNG.png'
import SubstanceDesignerIcon from '../../assets/SubstanceDesigner_PNG.png'
import SubstancePainterIcon from '../../assets/SubstancePainter_PNG.png'
import UnityIcon from '../../assets/Unity_PNG.png'
import UnrealIcon from '../../assets/UnrealEngine_PNG.png'
import ZBrushIcon from '../../assets/Zbrush_PNG.png'

const toolDefinitions = [
  {
    key: 'blender',
    label: 'Blender',
    aliases: ['blender'],
    icon: BlenderIcon,
  },
  {
    key: 'unity',
    label: 'Unity',
    aliases: ['unity'],
    icon: UnityIcon,
  },
  {
    key: 'unreal',
    label: 'Unreal Engine',
    aliases: ['unreal', 'unreal engine', 'unrealengine', 'ue', 'ue5', 'ue4'],
    icon: UnrealIcon,
  },
  {
    key: 'substance-painter',
    label: 'Substance Painter',
    aliases: ['substance painter', 'substance 3d painter', 'substancepainter', 'painter'],
    icon: SubstancePainterIcon,
  },
  {
    key: 'substance-designer',
    label: 'Substance Designer',
    aliases: ['substance designer', 'substance 3d designer', 'substancedesigner', 'designer'],
    icon: SubstanceDesignerIcon,
  },
  {
    key: 'marmoset',
    label: 'Marmoset Toolbag',
    aliases: ['marmoset', 'marmoset toolbag', 'toolbag'],
    icon: MarmosetIcon,
  },
  {
    key: 'zbrush',
    label: 'ZBrush',
    aliases: ['zbrush', 'z brush'],
    icon: ZBrushIcon,
  },
  {
    key: 'maya',
    label: 'Maya',
    aliases: ['maya', 'autodesk maya'],
    icon: MayaIcon,
  },
  {
    key: '3ds-max',
    label: '3ds Max',
    aliases: ['3ds max', '3dsmax', '3d studio max', 'autodesk 3ds max'],
    icon: MaxIcon,
  },
  {
    key: 'photoshop',
    label: 'Photoshop',
    aliases: ['photoshop', 'adobe photoshop'],
    icon: PhotoshopIcon,
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
  const label = definition?.label || String(tool || 'Tool')
  const icon = definition?.icon

  return (
    <span className="tool-badge">
      {icon && <img src={icon} alt="" aria-hidden="true" className="tool-badge__icon" />}
      <span className="tool-badge__label">{label}</span>
    </span>
  )
}

export function ToolBadgeGrid({ tools = [] }) {
  const items = [...new Set(tools.filter(Boolean))]
  if (!items.length) return <p className="text-sm text-zinc-500">Not specified yet.</p>

  return (
    <div className="tool-badge-list">
      {items.map((tool) => (
        <ToolBadge key={typeof tool === 'string' ? tool : tool.key} tool={getToolDefinition(tool) || tool} />
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
