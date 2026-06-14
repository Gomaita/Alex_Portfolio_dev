const SITE_ORIGIN = 'https://alexgl.dev'
const FALLBACK_OG_IMAGE = '/og-image.svg'

const routeMetadata = {
  home: {
    title: 'Alex Gómez | Junior Software Developer',
    description: 'Portfolio with practical software demos focused on React, APIs, SQL, Cloudflare, security and blockchain concepts.',
    path: '/',
    image: FALLBACK_OG_IMAGE,
    imageAlt: 'Alex Gómez Junior Software Developer portfolio preview',
  },
  threeD: {
    title: 'Alex Gómez | 3D Environment & Prop Artist',
    description: '3D portfolio focused on props, environments, PBR texturing, Unreal Engine, Unity, Substance tools and real-time optimized assets.',
    path: '/3d',
    image: FALLBACK_OG_IMAGE,
    imageAlt: 'Alex Gómez 3D Environment and Prop Artist portfolio preview',
  },
  software: {
    title: 'Alex Gómez | Software Portfolio',
    description: 'Interactive software projects focused on frontend development, databases, APIs, role-based systems and responsive product experiences.',
    path: '/portfolio',
    image: FALLBACK_OG_IMAGE,
    imageAlt: 'Alex Gómez software portfolio preview',
  },
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function absoluteUrl(path) {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

function getMetadataForPath(pathname) {
  if (pathname === '/3d' || pathname.startsWith('/3d/')) {
    return routeMetadata.threeD
  }

  if (pathname === '/portfolio' || pathname.startsWith('/portfolio/') || pathname === '/software' || pathname.startsWith('/software/')) {
    return {
      ...routeMetadata.software,
      path: pathname.startsWith('/software') ? '/software' : '/portfolio',
    }
  }

  return routeMetadata.home
}

function replaceOrInsertHeadTag(html, pattern, replacement) {
  if (pattern.test(html)) return html.replace(pattern, replacement)
  return html.replace('</head>', `    ${replacement}\n  </head>`)
}

function applyMetadata(html, metadata) {
  const title = escapeHtml(metadata.title)
  const description = escapeHtml(metadata.description)
  const pageUrl = escapeHtml(absoluteUrl(metadata.path))
  const imageUrl = escapeHtml(absoluteUrl(metadata.image))
  const imageAlt = escapeHtml(metadata.imageAlt)

  let output = html
  output = replaceOrInsertHeadTag(output, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
  output = replaceOrInsertHeadTag(output, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`)
  output = replaceOrInsertHeadTag(output, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${pageUrl}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, '<meta property="og:type" content="website" />')
  output = replaceOrInsertHeadTag(output, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${pageUrl}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${imageUrl}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image:alt" content="${imageAlt}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/i, '<meta name="twitter:card" content="summary_large_image" />')
  output = replaceOrInsertHeadTag(output, /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${pageUrl}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${imageUrl}" />`)
  output = replaceOrInsertHeadTag(output, /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image:alt" content="${imageAlt}" />`)

  return output
}

export async function onRequest(context) {
  const response = await context.next()
  const request = context.request

  if (request.method !== 'GET') return response

  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) return response

  const url = new URL(request.url)
  const metadata = getMetadataForPath(url.pathname)
  const html = await response.text()
  const rewrittenHtml = applyMetadata(html, metadata)
  const headers = new Headers(response.headers)

  headers.set('content-type', 'text/html; charset=UTF-8')
  headers.delete('content-length')
  headers.delete('etag')

  return new Response(rewrittenHtml, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
