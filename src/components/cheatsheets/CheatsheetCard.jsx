import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

function CheatsheetCard({ cheatsheet }) {
  const topics = cheatsheet.sections.slice(0, 3).map((section) => section.title)

  return (
    <Card className="flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-base font-bold text-blue-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-200">
        {cheatsheet.iconText}
      </div>
      <Badge tone="neutral">{cheatsheet.category}</Badge>
      <h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{cheatsheet.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {cheatsheet.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Badge key={topic} tone="violet">
            {topic}
          </Badge>
        ))}
      </div>
      <Link
        to={`/cheatsheets/${cheatsheet.slug}`}
        className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-none dark:hover:bg-slate-800 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950"
      >
        Open cheatsheet
      </Link>
    </Card>
  )
}

export default CheatsheetCard
