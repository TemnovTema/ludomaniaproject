import './style.css'
import { createSceneMarkup } from '../../shared/scene.js'

export function renderBoundaries(app) {
  app.innerHTML = createSceneMarkup({
    id: 'boundaries',
    title: 'Границы',
    description: 'Здесь будет сцена о личных границах, безопасности и том, что вы не обязаны решать всё в одиночку.',
  })
}
