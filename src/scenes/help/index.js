import './style.css'
import { createSceneMarkup } from '../../shared/scene.js'

export function renderHelp(app) {
  app.innerHTML = createSceneMarkup({
    id: 'help',
    title: 'Помощь',
    description: 'Здесь будут маршруты помощи: к кому обратиться и какие шаги можно сделать уже сейчас.',
  })
}
