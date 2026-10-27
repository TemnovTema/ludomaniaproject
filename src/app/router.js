import { sections } from './sections.js'
import { renderLanding } from '../landing/index.js'
import { renderRecognition } from '../scenes/recognition/index.js'
import { renderConversation } from '../scenes/conversation/index.js'
import { renderHelp } from '../scenes/help/index.js'
import { renderBoundaries } from '../scenes/boundaries/index.js'
import { renderSelfSupport } from '../scenes/self-support/index.js'
import { renderResponsibility } from '../scenes/responsibility/index.js'

const sceneRenderers = {
  recognition: renderRecognition,
  conversation: renderConversation,
  help: renderHelp,
  boundaries: renderBoundaries,
  'self-support': renderSelfSupport,
  responsibility: renderResponsibility,
}

function currentRoute() {
  return window.location.hash.replace(/^#/, '')
}

function renderRoute() {
  const route = currentRoute()
  const renderScene = sceneRenderers[route]
  const app = document.querySelector('#app')

  if (!renderScene) {
    document.title = 'Ставка на себя'
    renderLanding(app, sections)
    return
  }

  const page = sections.find((section) => section.id === route)
  document.title = (page?.title || 'Сцена') + ' — Ставка на себя'
  renderScene(app)
}

export function startRouter() {
  window.addEventListener('hashchange', renderRoute)
  renderRoute()
}

