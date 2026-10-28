import { sections } from './sections.js'
import { renderLanding } from '../landing/index.js'
import { renderRecognition } from '../scenes/recognition/index.js'
import { renderConversation as renderStoryConversation } from '../scenes/recognition/stages/conversation/index.js'
import { renderHelp as renderStoryHelp } from '../scenes/recognition/stages/help/index.js'
import { renderSelfSupport as renderStorySelfSupport } from '../scenes/recognition/stages/self-support/index.js'
import { renderResponsibility as renderStoryResponsibility } from '../scenes/recognition/stages/responsibility/index.js'
import { renderResearch } from '../pages/research/index.js'
import { renderHelpPage } from '../pages/help/index.js'
import { renderBoundariesPage } from '../pages/boundaries/index.js'
import { renderSelfSupportPage } from '../pages/self-support/index.js'
import { renderResponsibilityPage } from '../pages/responsibility/index.js'

const storyRoutes = {
  recognition: { render: renderRecognition, title: 'узнавание' },
  'recognition/conversation': { render: renderStoryConversation, title: 'разговор' },
  'recognition/help': { render: renderStoryHelp, title: 'помощь' },
  'recognition/self-support': { render: renderStorySelfSupport, title: 'поддержка себя' },
  'recognition/responsibility': { render: renderStoryResponsibility, title: 'разделение ответственности' },
}

const pageRoutes = {
  research: renderResearch,
  help: renderHelpPage,
  boundaries: renderBoundariesPage,
  'self-support': renderSelfSupportPage,
  responsibility: renderResponsibilityPage,
}

function currentRoute() {
  return window.location.hash.replace(/^#/, '')
}

function renderRoute() {
  const route = currentRoute()
  const app = document.querySelector('#app')
  const story = storyRoutes[route]

  if (story) {
    document.title = story.title + ' — Ставка на себя'
    story.render(app)
    return
  }

  const renderPage = pageRoutes[route]
  if (renderPage) {
    const page = sections.find((section) => section.id === route)
    document.title = (page?.title || 'Страница').replace('\n', ' ') + ' — Ставка на себя'
    renderPage(app)
    return
  }

  document.title = 'Ставка на себя'
  renderLanding(app, sections)
}

export function startRouter() {
  window.addEventListener('hashchange', renderRoute)
  renderRoute()
}

