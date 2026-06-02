import { useMemo, useState } from 'react'
import { techStack } from '../data/techStack'

const categories = ['All', ...techStack.map((group) => group.category)]

const levelStyles = {
  Comfortable: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200',
  Practicing: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  Learning: 'border-violet-300/25 bg-violet-300/10 text-violet-100',
}

function TechStackExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const visibleGroups = useMemo(() => {
    if (selectedCategory === 'All') {
      return techStack
    }

    return techStack.filter((group) => group.category === selectedCategory)
  }, [selectedCategory])

  return (
    <section className="border-t border-white/10 bg-slate-950 px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Technical Focus
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-white">
            Tools I am building with
          </h2>
          <p className="mt-3 leading-7 text-slate-300">
            A practical view of the technologies I use while growing as a junior
            developer, including my 3D and interactive background.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                selectedCategory === category
                  ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
                  : 'border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {visibleGroups.map((group) => (
            <article
              key={group.category}
              className="rounded-md border border-white/10 bg-white/[0.04] p-5"
            >
              <h3 className="text-xl font-bold text-white">{group.category}</h3>
              <div className="mt-4 grid gap-4">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-md border border-white/10 bg-slate-950/60 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <span
                        className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                          levelStyles[item.level]
                        }`}
                      >
                        {item.level}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                    <p className="mt-2 text-xs font-medium text-cyan-200">
                      Used in: {item.usedIn}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStackExplorer
