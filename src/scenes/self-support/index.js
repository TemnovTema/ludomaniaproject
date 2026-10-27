import './style.css'
import { createSceneMarkup } from '../../shared/scene.js'

export function renderSelfSupport(app) {
  app.innerHTML = createSceneMarkup({
    id: 'self-support',
    title: 'Поддержка себя',
    description: 'Здесь будут практики самоподдержки и напоминания о том, как беречь себя рядом с чужой зависимостью.',
  })
}
