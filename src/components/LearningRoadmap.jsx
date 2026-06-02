import { learningRoadmap } from '../data/learningRoadmap'

function LearningRoadmap() {
  return (
    <section className="mt-8 rounded-md border border-white/10 bg-white/[0.04] p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
        Learning Roadmap
      </p>
      <h2 className="mt-2 text-2xl font-bold text-white">
        What I am improving next
      </h2>
      <p className="mt-3 max-w-3xl leading-7 text-slate-300">
        I am keeping the portfolio focused on small technical demos because they
        make progress visible: each feature teaches a specific part of how real
        applications work.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {learningRoadmap.map((item) => (
          <article
            key={item.title}
            className="rounded-md border border-white/10 bg-slate-950/60 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
              {item.status}
            </p>
            <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {item.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-100"
                >
                  {topic}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LearningRoadmap
