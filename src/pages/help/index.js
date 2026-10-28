import './style.css'

export function renderHelpPage(app) {
  app.innerHTML = `<main class="project-page project-page--help" aria-label="Помощь">
    <h1>помощь</h1>
    <a class="project-page__back" href="#menu">к меню</a>
  </main>`
}
