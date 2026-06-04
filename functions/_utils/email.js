function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeContactMessage(contactMessage) {
  return {
    id: contactMessage?.id || 'Unknown message id',
    name: contactMessage?.name || 'Unknown name',
    email: contactMessage?.email || 'No email provided',
    message: contactMessage?.message || 'No message content',
    created_at: contactMessage?.created_at || 'Unknown date',
  }
}

function buildTextMessage(contactMessage) {
  const message = normalizeContactMessage(contactMessage)

  return [
    'New message from alexgl.dev',
    '',
    'From:',
    message.name,
    message.email,
    '',
    'Message:',
    message.message,
    '',
    'Details:',
    `Message ID: ${message.id}`,
    `Created at: ${message.created_at}`,
    'Source: alexgl.dev',
    'Stored in D1: yes',
    '',
    'This notification was sent automatically from your portfolio contact form.',
  ].join('\n')
}

function buildHtmlMessage(contactMessage) {
  const message = normalizeContactMessage(contactMessage)
  const safeName = escapeHtml(message.name)
  const safeEmail = escapeHtml(message.email)
  const safeMessage = escapeHtml(message.message).replaceAll('\n', '<br />')
  const safeCreatedAt = escapeHtml(message.created_at)
  const safeId = escapeHtml(message.id)

  return `
    <!doctype html>
    <html>
      <body style="margin: 0; padding: 0; background: #f6f8fb; font-family: Arial, Helvetica, sans-serif; color: #111827;">
        <div style="width: 100%; background: #f6f8fb; padding: 28px 16px;">
          <div style="max-width: 600px; margin: 0 auto;">
            <div style="background: #0f172a; border-radius: 14px 14px 0 0; padding: 28px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; line-height: 1.3; font-weight: 700;">
                New message from alexgl.dev
              </h1>
              <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 15px; line-height: 1.5;">
                Someone used the contact form on your portfolio.
              </p>
            </div>

            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: 0; border-radius: 0 0 14px 14px; padding: 30px;">
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px; color: #2563eb; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
                  From
                </p>
                <p style="margin: 0; color: #111827; font-size: 20px; line-height: 1.4; font-weight: 700;">
                  ${safeName}
                </p>
                <p style="margin: 4px 0 0; color: #64748b; font-size: 15px; line-height: 1.5;">
                  ${safeEmail}
                </p>
              </div>

              <div style="margin-bottom: 26px; padding: 22px; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; border-radius: 12px;">
                <p style="margin: 0 0 12px; color: #2563eb; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
                  Message
                </p>
                <p style="margin: 0; color: #111827; font-size: 17px; line-height: 1.7;">
                  ${safeMessage}
                </p>
              </div>

              <div style="padding-top: 18px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 10px; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
                  Details
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Message ID</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; text-align: right;">${safeId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Created at</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; text-align: right;">${safeCreatedAt}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Source</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; text-align: right;">alexgl.dev</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b; font-size: 13px;">Stored in D1</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; text-align: right;">yes</td>
                  </tr>
                </table>
              </div>
            </div>

            <p style="margin: 16px 0 0; color: #64748b; font-size: 12px; line-height: 1.5; text-align: center;">
              This notification was sent automatically from your portfolio contact form.
            </p>
          </div>
        </div>
      </body>
    </html>
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

  const message = normalizeContactMessage(contactMessage)
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>',
      to: env.CONTACT_NOTIFICATION_EMAIL,
      subject: `New portfolio message from ${message.name}`,
      text: buildTextMessage(message),
      html: buildHtmlMessage(message),
    }),
  })

  if (!response.ok) {
    return {
      ok: false,
      skipped: false,
      status: response.status,
      message: 'Resend email request failed.',
    }
  }

  return { ok: true, skipped: false }
}
