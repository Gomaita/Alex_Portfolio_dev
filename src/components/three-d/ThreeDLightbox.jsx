import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect } from 'react'
import RichTextDescription from './RichTextDescription'

function ThreeDLightbox({ images, activeIndex, onClose, onNext, onPrevious }) {
  const activeImage = images[activeIndex]

  useEffect(() => {
    if (!activeImage) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft') onPrevious()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeImage, onClose, onNext, onPrevious])

  if (!activeImage) return null

  return (
    <div className="fixed inset-0 z-[80] bg-black/95 p-4 text-white backdrop-blur" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
        aria-label="Close image preview"
      >
        <X size={22} />
      </button>
      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:bg-white/20"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <img
          src={activeImage.url}
          alt={activeImage.alt || activeImage.caption || '3D project image'}
          className="max-h-[78vh] max-w-full rounded-xl object-contain"
        />
        <div className="max-w-3xl text-center">
          <p className="text-sm font-bold text-zinc-300">{activeIndex + 1} / {images.length}</p>
          {activeImage.caption && <RichTextDescription text={activeImage.caption} className="mt-2 text-sm text-zinc-400" />}
        </div>
      </div>
    </div>
  )
}

export default ThreeDLightbox
