import './style.css'
import { createSceneMarkup } from '../../shared/scene.js'

export function renderConversation(app) {
  app.innerHTML = createSceneMarkup({
    id: 'conversation',
    title: 'Разговор',
    description: 'Здесь появится сцена о том, как начать разговор с близким бережно и без давления.',
  })
}
