import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'

function SkillCard({ name, index }) {
  return (
    <motion.div
      className="rounded-md border border-white/10 bg-white/[0.04] p-4 text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-200">
          <Code2 size={18} />
        </span>
        <p className="font-semibold">{name}</p>
      </div>
    </motion.div>
  )
}

export default SkillCard
