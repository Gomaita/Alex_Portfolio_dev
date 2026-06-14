function CaseStudySection({ children, eyebrow, title }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-5 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/20 sm:p-6">
      {eyebrow && (
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600 dark:text-sky-300">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default CaseStudySection
