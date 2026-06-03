function Section({ children, className = '', containerClassName = '', id }) {
  return (
    <section
      id={id}
      className={`bg-[#F6F8FB] px-5 py-16 sm:px-6 lg:px-8 dark:bg-slate-950 ${className}`}
    >
      <div className={`mx-auto max-w-6xl ${containerClassName}`}>{children}</div>
    </section>
  )
}

export default Section
