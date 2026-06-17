import { useEffect, useRef } from 'react'

function InteractiveHomeBackground() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return undefined

    let frame = null
    let mouseX = 50
    let mouseY = 40

    function applyVariables() {
      frame = null

      root.style.setProperty('--home-mouse-x', `${mouseX}%`)
      root.style.setProperty('--home-mouse-y', `${mouseY}%`)
      root.style.setProperty('--home-scroll', `${Math.min((window.scrollY || 0) * 0.025, 24)}px`)
    }

    function scheduleUpdate() {
      if (frame !== null) return
      frame = requestAnimationFrame(applyVariables)
    }

    function handlePointerMove(event) {
      mouseX = (event.clientX / window.innerWidth) * 100
      mouseY = (event.clientY / window.innerHeight) * 100
      scheduleUpdate()
    }

    function handleScroll() {
      scheduleUpdate()
    }

    applyVariables()
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('scroll', handleScroll)
      if (frame !== null) cancelAnimationFrame(frame)
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
