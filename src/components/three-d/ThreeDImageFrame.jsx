function ThreeDImageFrame({ src, alt, className = '', priority = false }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.32),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(249,115,22,0.20),transparent_24%),linear-gradient(135deg,#181d24,#0f1217)] ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.08),transparent)]" />
      <span className="relative rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-zinc-300">
        Image placeholder
      </span>
    </div>
  )
}

export default ThreeDImageFrame
