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
  ['C#', 'CSharp_PNG.png'],
  ['Git', 'Git_PNG.png'],
  ['GitHub', 'GitHub_PNG.png'],
  ['Cloudflare', 'Cloudflare_PNG.png'],
  ['APIs', 'API_PNG.png'],
  ['Vite', 'Vite_PNG.png'],
]

const softwareIconModules = import.meta.glob('../../assets/icons/software/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const softwareIcons = Object.fromEntries(
  Object.entries(softwareIconModules).map(([path, url]) => [path.split('/').pop(), url]),
)

export function SoftwareTechBadge({ label, file, className = '' }) {
  const icon = softwareIcons[file]

  return (
    <span className={`group inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 text-xs font-semibold text-slate-200 shadow-sm shadow-black/10 backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.085] ${className}`}>
      {icon && <img src={icon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />}
      {label}
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
