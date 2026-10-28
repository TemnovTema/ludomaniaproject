import './style.css'

export function renderSelfSupportPage(app) {
  app.innerHTML = `<main class="project-page project-page--self-support" aria-label="Поддержка себя">
    <h1>поддержка себя</h1>
    <a class="project-page__back" href="#menu">к меню</a>
  </main>`
}
