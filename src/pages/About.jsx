import { Mail } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import CVDownloads from '../components/ui/CVDownloads'

const timeline = [
  'Multimedia Engineering',
  '3D / VR background',
  'Software development focus',
  'Building practical portfolio projects',
]

const workCards = [
  {
    title: 'I learn by building',
    text: 'I understand concepts better when I turn them into small working projects.',
  },
  {
    title: 'I keep projects small but complete',
    text: 'The goal is not complexity. The goal is a full flow that works and is easy to read.',
  },
  {
    title: 'I care about structure and readability',
    text: 'Clear files, simple data and readable components make the project easier to improve.',
  },
  {
    title: 'I mix technical and visual thinking',
    text: 'My 3D and VR background helps me notice interaction, spacing and visual clarity.',
  },
]

function About() {
  return (
    <main className="min-h-[calc(100svh-4rem)] bg-[#F6F8FB] dark:bg-slate-950">
      <Section className="pt-16">
        <PageHeader
          eyebrow="About me"
          title="A junior software developer with a multimedia and interactive background."
          description="I studied Multimedia Engineering and worked around 3D environments, VR and real-time tools. That background made me pay attention to visual detail, optimization and how people interact with digital products."
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              From multimedia and 3D environments to software development
            </h2>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              Now I am focused on building practical software projects with
              React, APIs, databases and clean UI patterns. I am still early in
              my career, so I care about making the work understandable: what it
              does, what I practiced and how it is structured.
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Path so far</h2>
            <ol className="mt-5 space-y-4">
              {timeline.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1 font-medium text-slate-700 dark:text-slate-200">{item}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </Section>

      <Section className="bg-white dark:bg-slate-900">
        <PageHeader
          eyebrow="How I work"
          title="Simple habits I want to keep improving"
          description="I try to keep the work honest, focused and easy to explain."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {workCards.map((card) => (
            <Card key={card.title} className="p-5">
              <h2 className="font-bold text-slate-950 dark:text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{card.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                Download my CV
              </h2>
              <p className="mt-2 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
                Choose the version that fits best: an ATS-friendly CV for
                recruitment systems or a more visual version with a personal
                layout.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CVDownloads />
              <Button to="/contact">
                Contact me <Mail size={18} />
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </main>
  )
}

export default About
