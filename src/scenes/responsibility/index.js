import './style.css'
import { createSceneMarkup } from '../../shared/scene.js'

export function renderResponsibility(app) {
  app.innerHTML = createSceneMarkup({
    id: 'responsibility',
    title: 'Разделение ответственности',
    description: 'Здесь будет сцена о том, за что отвечает близкий, а за что отвечаете вы.',
  })
}
