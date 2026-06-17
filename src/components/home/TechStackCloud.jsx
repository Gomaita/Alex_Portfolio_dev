export const softwareTechStack = [
  ['React', 'React_PNG.png'],
  ['JavaScript', 'JavaScript_PNG.png'],
  ['TypeScript', 'TypeScript_PNG.png'],
  ['HTML5', 'HTML5_PNG.png'],
  ['CSS3', 'CSS3_PNG.png'],
  ['Node.js', 'Node_PNG.png'],
  ['SQL', 'SQL_PNG.png'],
  ['Oracle', 'Oracle_PNG.png'],
  ['Java', 'Java_PNG.png'],
  ['C#', ['CSharp_PNG.png', 'C#_PNG.png', 'CSharp.png']],
  ['C++', ['CPlusPlus_PNG.png', 'Cpp_PNG.png', 'C++_PNG.png']],
  ['Git', 'Git_PNG.png'],
  ['GitHub', ['GitHub_PNG.png', 'Github_PNG.png']],
  ['Cloudflare', 'Cloudflare_PNG.png'],
  ['APIs', 'API_PNG.png'],
  ['Vite', 'Vite_PNG.png'],
]

const toolAliases = {
  react: 'React',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  html5: 'HTML5',
  html: 'HTML5',
  css3: 'CSS3',
  css: 'CSS3',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  sql: 'SQL',
  database: 'SQL',
  databases: 'SQL',
  oracle: 'Oracle',
  java: 'Java',
  'c#': 'C#',
  csharp: 'C#',
  'c sharp': 'C#',
  'c++': 'C++',
  cpp: 'C++',
  cplusplus: 'C++',
  'c plus plus': 'C++',
  git: 'Git',
  github: 'GitHub',
  cloudflare: 'Cloudflare',
  api: 'APIs',
  apis: 'APIs',
  'rest api': 'APIs',
  vite: 'Vite',
}

const softwareIconModules = import.meta.glob('../../assets/icons/software/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const softwareIcons = Object.fromEntries(
  Object.entries(softwareIconModules).map(([path, url]) => [path.split('/').pop(), url]),
)

export function normalizeSoftwareLabel(label) {
  const key = String(label || '').trim().toLowerCase()
  return toolAliases[key] || String(label || '').trim()
}

function resolveIcon(file) {
  const files = Array.isArray(file) ? file : [file]
  return files.map((entry) => softwareIcons[entry]).find(Boolean)
}

export function SoftwareTechBadge({ label, file, className = '' }) {
  const normalizedLabel = normalizeSoftwareLabel(label)
  const icon = resolveIcon(file)

  return (
    <span className={`group inline-flex h-8 items-center gap-2 rounded-full border border-white/10 bg-[#3f3f46]/80 px-3 text-[0.76rem] font-semibold leading-none text-slate-100 shadow-sm shadow-black/10 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#4a4a50] ${className}`}>
      {icon && <img src={icon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />}
      {normalizedLabel}
    </span>
  )
}

function TechStackCloud({ items = softwareTechStack, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      {items.map(([label, file]) => (
        <SoftwareTechBadge key={label} label={label} file={file} />
      ))}
    </div>
  )
}

export default TechStackCloud
