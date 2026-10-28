let pendingAdviceRoute = null

export function returnToPreviousAdvice(route) {
  pendingAdviceRoute = route
  window.location.hash = route
}

export function shouldRestoreAdvice(route) {
  if (pendingAdviceRoute !== route) return false
  pendingAdviceRoute = null
  return true
}
