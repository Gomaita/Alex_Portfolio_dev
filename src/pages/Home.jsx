import { ArrowRight, Boxes, ShieldCheck } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import CVDownloads from '../components/ui/CVDownloads'
import ProjectCard from '../components/project/ProjectCard'
import { projects } from '../data/projects'

const buildCards = [
  {
    title: 'API-driven interfaces',
    text: 'Small dashboards and tools that fetch, format and display external data.',
  },
  {
    title: 'CRUD and state-based tools',
    text: 'Interactive demos with forms, filters, localStorage and predictable UI states.',
  },
  {
    title: 'Developer learning resources',
    text: 'Cheatsheets and small utilities designed to reinforce programming concepts.',
  },
]

const focusGroups = [
  {
    title: 'Frontend',
    items: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind'],
  },
  {
    title: 'Data / backend basics',
    items: ['SQL', 'Java', 'REST APIs', 'Data handling'],
  },
  {
    title: 'Tools',
    items: ['Git', 'Vite', 'npm', 'VS Code'],
  },
  {
    title: 'Creative technical background',
    items: ['Unity', 'Unreal Engine', 'VR', 'Shaders', 'Real-time environments'],
  },
]

function Home() {
  const selectedProjectSlugs = [
    'api-health-monitor',
    'd1-database-metrics',
    'secure-users-roles-demo',
    'sql-query-playground',
  ]
  const selectedProjects = selectedProjectSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter(Boolean)

  return (
    <>
      <section className="bg-[#F6F8FB] px-5 py-16 sm:px-6 lg:px-8 dark:bg-slate-950">
        <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl items-center py-8">
          <div className="max-w-5xl">
            <Badge tone="blue">
              Junior Software Developer - Multimedia Engineering background
            </Badge>
            <h1 className="mt-7 max-w-5xl text-6xl font-bold tracking-normal text-slate-950 sm:text-7xl lg:text-8xl dark:text-white">
              Learning software by building things that actually work.
            </h1>
            <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-600 sm:text-2xl sm:leading-10 dark:text-slate-300">
              I am Alex Gómez, a junior software developer with a Multimedia
              Engineering background. I am focused on React, APIs, SQL and
              interactive interfaces, building small projects that help me
              understand how real applications are structured.
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500 dark:text-slate-400">
              Before focusing on software, I worked around 3D environments, VR
              and real-time tools. That background helps me care about visual
              clarity, structure and how people interact with what I build.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/portfolio" variant="primary">
                View projects <ArrowRight size={17} />
              </Button>
              <Button to="/cheatsheets">Explore cheatsheets</Button>
            </div>
            <CVDownloads layout="inline" className="mt-5" />
          </div>
        </div>
      </section>

      <Section>
        <PageHeader
          eyebrow="What I build"
          title="Small projects with complete flows"
          description="I use focused projects to practice the parts of frontend work that matter in real applications."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {buildCards.map((card) => (
            <Card key={card.title} className="p-6" variant="interactive">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">{card.title}</h2>
              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{card.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white dark:bg-slate-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <PageHeader
            eyebrow="Selected projects"
            title="A few practical demos"
            description="No full demos on the home page. Just a quick path into the project pages."
          />
          <Button to="/portfolio" className="mb-10 w-fit">
            Browse portfolio <ArrowRight size={17} />
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {selectedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Section>

      <Section>
        <Card className="overflow-hidden border-slate-800 bg-slate-950 p-0 text-white">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,#0891b233,transparent_34%),#020617] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <Badge tone="cyan">Security Lab</Badge>
              <h2 className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl">
                Security Operations Center Lite
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                A more complete defensive security interface built to practice monitoring, firewall logic, incident review and risk scoring.
              </p>
              <Button to="/security-lab" variant="primary" className="mt-6">
                Open Security Lab <ArrowRight size={17} />
              </Button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
              {['Traffic monitor', 'Firewall rules', 'Request simulator', 'Incident review'].map((item) => (
                <div key={item} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <ShieldCheck className="text-cyan-300" size={22} />
                  <p className="mt-3 font-semibold text-slate-100">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Privacy-safe simulated security workflow.</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Section>

      <Section className="bg-white dark:bg-slate-900">
        <Card className="overflow-hidden border-slate-800 bg-slate-950 p-0 text-white">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,#7c3aed33,transparent_36%),#020617] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <Badge tone="violet">Blockchain Lab</Badge>
              <h2 className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl">
                Smart Escrow & Contract Security Dashboard
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                A larger Web3 learning project focused on escrow logic, smart contract states, role permissions, dispute workflows and contract security.
              </p>
              <Button to="/blockchain-lab" variant="primary" className="mt-6">
                Open Blockchain Lab <ArrowRight size={17} />
              </Button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
              {['Escrow simulator', 'Contract states', 'Risk analyzer', 'Dispute voting'].map((item) => (
                <div key={item} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <Boxes className="text-violet-300" size={22} />
                  <p className="mt-3 font-semibold text-slate-100">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Educational Web3 simulation with no real funds.</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Section>

      <Section>
        <PageHeader
          eyebrow="Technical focus"
          title="The areas I am practicing"
          description="A mix of frontend fundamentals, data handling and the creative technical background I bring from 3D and VR."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {focusGroups.map((group) => (
            <Card key={group.title} className="p-6" variant="interactive">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">{group.title}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item} tone="neutral">
                    {item}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white dark:bg-slate-900">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-950 dark:text-white">
                Want to see how it works?
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
                The portfolio includes small, complete demos focused on real
                frontend problems: fetching data, handling errors, forms,
                routing and reusable components.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to="/portfolio" variant="primary">
                Browse portfolio
              </Button>
              <Button to="/contact">Contact me</Button>
            </div>
          </div>
        </Card>
      </Section>
    </>
  )
}

export default Home
