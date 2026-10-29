const METRIKA_ID = 113864752

function ym(...args) {
  window.ym?.(...args)
}

export function initMetrika() {
  if (document.querySelector('[data-yandex-metrika]')) return

  window.ym = window.ym || function metrikaQueue(...args) {
    ;(window.ym.a = window.ym.a || []).push(args)
  }
  window.ym.l = Date.now()

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://mc.yandex.ru/metrika/tag.js'
  script.dataset.yandexMetrika = 'true'
  document.head.append(script)

  ym(METRIKA_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
  })
}

export function trackPageView(route) {
  if (!route) return
  ym(METRIKA_ID, 'hit', `${window.location.pathname}#${route}`)
}

export function trackGoal(goal) {
  ym(METRIKA_ID, 'reachGoal', goal)
}
