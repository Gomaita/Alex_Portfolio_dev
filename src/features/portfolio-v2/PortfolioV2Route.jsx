import { lazy, Suspense, useLayoutEffect } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))

// Own metadata at the route boundary, including while the page chunk loads.
export default function PortfolioV2Route() {
  useLayoutEffect(() => {
    const previousTitle = document.title
    const title = 'Alex Gómez — Software Developer'
    const description = 'Software, curiosity and practical projects. Explore selected work by Alex Gómez, a Multimedia Engineering graduate from the University of Alicante.'
    const restore = []
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const rootStyle = document.documentElement.style
    const previousScroll = rootStyle.getPropertyValue('scroll-behavior')
    const previousPriority = rootStyle.getPropertyPriority('scroll-behavior')
    const updateScroll = () => rootStyle.setProperty('scroll-behavior', motionPreference.matches ? 'auto' : 'smooth')
    updateScroll()
    motionPreference.addEventListener('change', updateScroll)
    document.title = title
    const entries = [
      ['meta[name="description"]', 'meta', 'name', 'description', 'content', description],
      ['meta[name="robots"]', 'meta', 'name', 'robots', 'content', 'noindex, nofollow'],
      ['meta[name="theme-color"]', 'meta', 'name', 'theme-color', 'content', '#ffffff'],
      ['link[rel="canonical"]', 'link', 'rel', 'canonical', 'href', 'https://alexgl.dev/newindex'],
      ...['og', 'twitter'].flatMap((type) => ['title', 'description', 'url'].map((key) => [
        `meta[${type === 'og' ? 'property' : 'name'}="${type}:${key}"]`, 'meta',
        type === 'og' ? 'property' : 'name', `${type}:${key}`, 'content',
        key === 'title' ? title : key === 'description' ? description : 'https://alexgl.dev/newindex',
      ])),
    ]
    entries.forEach(([selector, tag, attribute, key, valueAttribute, value]) => {
      const existing = document.head.querySelector(selector)
      const element = existing || document.createElement(tag)
      const previous = element.getAttribute(valueAttribute)
      element.setAttribute(attribute, key)
      element.setAttribute(valueAttribute, value)
      if (!existing) document.head.append(element)
      restore.push(() => {
        if (!existing) element.remove()
        else if (previous === null) element.removeAttribute(valueAttribute)
        else element.setAttribute(valueAttribute, previous)
      })
    })
    return () => {
      motionPreference.removeEventListener('change', updateScroll)
      if (previousScroll) rootStyle.setProperty('scroll-behavior', previousScroll, previousPriority)
      else rootStyle.removeProperty('scroll-behavior')
      document.title = previousTitle
      restore.forEach((reset) => reset())
    }
  }, [])

  return <Suspense fallback={<div role="status" style={{ minHeight: '100svh', padding: '3rem', background: '#fff', color: '#172033' }}>Loading portfolio…</div>}><HomePage /></Suspense>
}
