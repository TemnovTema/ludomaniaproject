import './result-screen.css'

export function renderResultScreen(app, result) {
  if (!result.ready) return false
  const recommendations = result.recommendedMaterials.map((material) => {
    const title = material.title && material.url
      ? `<a href="${material.url}">${material.title}</a>`
      : ''
    return `<li>${title}<p>${material.reason}</p></li>`
  }).join('')

  app.innerHTML = `<main class="story-result" aria-label="Результат теста">
    <div class="story-result__circle" aria-hidden="true"></div>
    <div class="story-result__content">
      <h1>${result.title}</h1>
      <section class="story-result__personal" aria-label="Что вы заметили">
        <h2>что вы заметили</h2>
        <p>${result.observation}</p>
      </section>
      <section class="story-result__starting" aria-label="С чего можно начать">
        <h2>${result.startingPointTitle}</h2>
        <ul>${recommendations}</ul>
      </section>
    </div>
    <a class="story-result__button" href="#help">${result.supportButton.toLowerCase()}</a>
    <p class="story-result__explanation">${result.explanation}</p>
  </main>`
  window.scrollTo({ top: 0, behavior: 'instant' })
  return true
}
