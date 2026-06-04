function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function buildTextMessage(contactMessage) {
  return [
    `New portfolio message from ${contactMessage.name}`,
    '',
    `Name: ${contactMessage.name}`,
    `Email: ${contactMessage.email}`,
    `Created at: ${contactMessage.created_at}`,
    'Source: alexgl.dev',
    `Message ID: ${contactMessage.id}`,
    '',
    'Message:',
    contactMessage.message,
  ].join('\n')
}

function buildHtmlMessage(contactMessage) {
  const safeName = escapeHtml(contactMessage.name)
  const safeEmail = escapeHtml(contactMessage.email)
  const safeMessage = escapeHtml(contactMessage.message).replaceAll('\n', '<br />')
  const safeCreatedAt = escapeHtml(contactMessage.created_at)
  const safeId = escapeHtml(contactMessage.id)

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2>New portfolio message</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Created at:</strong> ${safeCreatedAt}</p>
      <p><strong>Source:</strong> alexgl.dev</p>
      <p><strong>Message ID:</strong> ${safeId}</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    </div>
  `
}

export async function sendContactNotification(env, contactMessage) {
  if (!env.RESEND_API_KEY || !env.CONTACT_NOTIFICATION_EMAIL) {
    return {
      ok: false,
      skipped: true,
      reason: 'Email notifications are not configured.',
    }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>',
      to: env.CONTACT_NOTIFICATION_EMAIL,
      subject: `New portfolio message from ${contactMessage.name}`,
      text: buildTextMessage(contactMessage),
      html: buildHtmlMessage(contactMessage),
    }),
  })

  if (!response.ok) {
    return {
      ok: false,
      skipped: false,
      reason: `Resend returned status ${response.status}.`,
    }
  }

  return { ok: true, skipped: false }
}
