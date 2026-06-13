const urlPattern = /((?:https?:\/\/|www\.)[^\s<]+)/gi
const trailingPunctuationPattern = /[),.;:!?]+$/

function isUrlToken(value) {
  return /^(?:https?:\/\/|www\.)[^\s<]+$/i.test(value)
}

function splitUrlToken(token) {
  const trailing = token.match(trailingPunctuationPattern)?.[0] || ''
  const cleanUrl = trailing ? token.slice(0, -trailing.length) : token
  return { cleanUrl, trailing }
}

function renderInlineText(text, keyPrefix) {
  const parts = String(text).split(urlPattern)

  return parts.map((part, index) => {
    if (!part) return null
    if (!isUrlToken(part)) {
      return <span key={`${keyPrefix}-text-${index}`}>{part}</span>
    }

    const { cleanUrl, trailing } = splitUrlToken(part)
    const href = cleanUrl.startsWith('www.') ? `https://${cleanUrl}` : cleanUrl

    return (
      <span key={`${keyPrefix}-link-wrap-${index}`}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {cleanUrl}
        </a>
        {trailing}
      </span>
    )
  })
}

function RichTextDescription({ text, className = '' }) {
  if (!text || !String(text).trim()) return null

  const paragraphs = String(text)
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className={`rich-text-description ${className}`.trim()}>
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split('\n')

        return (
          <p key={`${paragraph.slice(0, 20)}-${paragraphIndex}`}>
            {lines.map((line, lineIndex) => (
              <span key={`${paragraphIndex}-${lineIndex}`}>
                {lineIndex > 0 && <br />}
                {renderInlineText(line, `${paragraphIndex}-${lineIndex}`)}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export default RichTextDescription
