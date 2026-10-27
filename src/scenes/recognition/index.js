import './style.css'
import { createSceneMarkup } from '../../shared/scene.js'

export function renderRecognition(app) {
  app.innerHTML = createSceneMarkup({
    id: 'recognition',
    title: 'Узнавание',
    description: 'Здесь будет первая сцена — история и признаки, которые помогают заметить проблему.',
  })
}
