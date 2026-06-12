import { useEffect, useMemo, useState } from 'react'
import ThreeDLayout from '../../components/three-d/ThreeDLayout'
import ThreeDProjectCard from '../../components/three-d/ThreeDProjectCard'
import usePageTitle from '../../hooks/usePageTitle'
import { getPublished3DProjects } from '../../services/threeDProjectsService'

const filters = ['All', 'Prop', 'Environment', 'Material', 'VR Asset', 'Personal Project']

function ThreeDProjects() {
  usePageTitle('3D Projects | Alex Gómez')
  const [projects, setProjects] = useState([])
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    getPublished3DProjects().then(setProjects)
  }, [])

  const filteredProjects = useMemo(
    () => activeFilter === 'All' ? projects : projects.filter((project) => project.category === activeFilter),
    [activeFilter, projects],
  )

  return (
    <ThreeDLayout>
      <section className="px-5 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-300">Gallery</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl">3D Projects</h1>
          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
            A visual gallery for props, environments, materials and real-time 3D studies.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeFilter === filter ? 'bg-sky-400 text-slate-950' : 'border border-white/10 text-zinc-300 hover:border-sky-300/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {filteredProjects.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ThreeDProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#12161c] p-8 text-center text-zinc-400">
              No 3D projects found for this filter yet.
            </div>
          )}
        </div>
      </section>
    </ThreeDLayout>
  )
}

export default ThreeDProjects
