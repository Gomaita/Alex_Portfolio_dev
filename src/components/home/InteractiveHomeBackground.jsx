import { useEffect, useRef } from 'react'

function InteractiveHomeBackground() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return undefined

    let frame = 0
    let targetX = 50
    let targetY = 40
    let currentX = 50
    let currentY = 40
    let currentScroll = 0

    function update() {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      currentScroll += ((window.scrollY || 0) - currentScroll) * 0.04

      root.style.setProperty('--home-mouse-x', `${currentX}%`)
      root.style.setProperty('--home-mouse-y', `${currentY}%`)
      root.style.setProperty('--home-scroll', `${Math.min(currentScroll * 0.035, 34)}px`)

      frame = requestAnimationFrame(update)
    }

    function handlePointerMove(event) {
      targetX = (event.clientX / window.innerWidth) * 100
      targetY = (event.clientY / window.innerHeight) * 100
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    frame = requestAnimationFrame(update)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="interactive-home-background"
      aria-hidden="true"
      style={{
        '--home-mouse-x': '50%',
        '--home-mouse-y': '38%',
        '--home-scroll': '0px',
      }}
    >
      <div className="interactive-home-background__base" />
      <div className="interactive-home-background__aurora interactive-home-background__aurora--cyan" />
      <div className="interactive-home-background__aurora interactive-home-background__aurora--violet" />
      <div className="interactive-home-background__aurora interactive-home-background__aurora--lime" />
      <div className="interactive-home-background__spotlight" />
      <div className="interactive-home-background__lines" />
      <div className="interactive-home-background__shade" />
    </div>
  )
}

export default InteractiveHomeBackground
