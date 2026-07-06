export function getReviewQueue(tickets) {
  return tickets.filter((ticket) => ticket.needsReview && !ticket.reviewed)
}

export function applyHumanReview(tickets, ticketId, patch) {
  return tickets.map((ticket) => {
    if (ticket.id !== ticketId) return ticket
    return {
      ...ticket,
      ...patch,
      reviewed: true,
      needsReview: false,
      confidence: Math.max(ticket.confidence || 0, 82),
      modelImprovementSignal: true,
    }
  })
}

export function reviewMetrics(tickets) {
  const reviewable = tickets.filter((ticket) => ticket.needsReview || ticket.reviewed)
  return {
    queued: tickets.filter((ticket) => ticket.needsReview && !ticket.reviewed).length,
    reviewed: tickets.filter((ticket) => ticket.reviewed).length,
    reviewRate: tickets.length ? Math.round((reviewable.length / tickets.length) * 100) : 0,
  }
}
