import { motion } from 'framer-motion'

function PageHeader({ align = 'left', eyebrow, title, description, children }) {
  const centered = align === 'center'

  return (
    <motion.header
      className={`mb-10 ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {eyebrow && (
        <p className="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-200">
          {eyebrow}
        </p>
      )}
      <h1 className="text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl dark:text-white">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
          {description}
        </p>
      )}
      {children}
    </motion.header>
  )
}

export default PageHeader
