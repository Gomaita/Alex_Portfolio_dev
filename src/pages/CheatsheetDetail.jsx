import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'
import CodeSnippet from '../components/cheatsheets/CodeSnippet'
import Section from '../components/ui/Section'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { getCheatsheetBySlug } from '../data/cheatsheets'

const slugify = (value) => value.toLowerCase().replaceAll(' ', '-')

const sectionLinkClass =
  'rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:border-slate-700 dark:text-slate-200 dark:hover:border-sky-700 dark:hover:bg-sky-950/50 dark:hover:text-sky-200 dark:focus:ring-sky-400 dark:focus:ring-offset-slate-950'

function CheatsheetDetail() {
  const { slug } = useParams()
  const cheatsheet = getCheatsheetBySlug(slug)

  if (!cheatsheet) {
    return (
      <Section className="min-h-[calc(100svh-4rem)] pt-16">
        <Card className="mx-auto max-w-3xl p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Cheatsheet not found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            The requested reference page does not exist.
          </p>
          <Button to="/cheatsheets" variant="primary" className="mt-6">
            Back to cheatsheets
          </Button>
        </Card>
      </Section>
    )
  }

  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#F6F8FB] dark:bg-slate-950">
      <Section className="pt-16">
        <Button to="/cheatsheets" size="small" className="mb-8">
          <ArrowLeft size={16} />
          Back to cheatsheets
        </Button>

        <Card className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-2xl font-bold text-blue-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-200">
              {cheatsheet.iconText}
            </div>
            <div>
              <Badge tone="neutral">{cheatsheet.category}</Badge>
              <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl dark:text-white">
                {cheatsheet.title} Cheatsheet
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
                {cheatsheet.description}
              </p>
            </div>
          </div>
        </Card>
      </Section>

      <Section>
        <nav
          className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
          aria-label="Cheatsheet sections"
        >
          {cheatsheet.sections.map((section) => (
            <a
              key={section.title}
              href={`#${slugify(section.title)}`}
              className={sectionLinkClass}
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cheatsheet.sections.map((section) => (
            <Card key={section.title} id={slugify(section.title)} className="p-4">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">{section.title}</h2>
              <div className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <CodeSnippet key={`${section.title}-${item.code}`} item={item} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  )
}

export default CheatsheetDetail
