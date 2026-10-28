import './style.css'

const navigationTitles = {
  research: 'research',
  help: 'помощь',
  boundaries: 'границы',
  'self-support': 'поддержка',
  responsibility: 'ответственность',
}

function navigationLinks(sections) {
  return sections
    .filter(({ id }) => id !== 'recognition')
    .map(({ id }) => `<a href="#${id}">${navigationTitles[id]}</a>`)
    .join('')
}

export function renderLanding(app, sections) {
  const links = navigationLinks(sections)

  app.innerHTML = [
    '<main class="home">',
    '<header class="home-header">',
    '<a class="home-brand" href="#menu" aria-label="Ставка на себя, на главную">ставка<br />на себя.</a>',
    '<nav class="home-nav" aria-label="Разделы проекта">', links, '</nav>',
    '<a class="home-header__story" href="#recognition">пройти историю <span aria-hidden="true">↗</span></a>',
    '<details class="home-menu">',
    '<summary aria-label="Открыть меню"><span></span><span></span></summary>',
    '<nav aria-label="Разделы проекта">', links, '<a class="home-menu__story" href="#recognition">пройти историю ↗</a>', '</nav>',
    '</details>',
    '</header>',
    '<section id="menu" class="home-hero" aria-labelledby="home-title">',
    '<div class="home-hero__copy">',
    '<p class="home-kicker">проект о&nbsp;лудомании и&nbsp;поддержке близких</p>',
    '<h1 id="home-title">когда играет близкий,<br />поддержка нужна и&nbsp;вам.</h1>',
    '<p class="home-lead">Интерактивная история помогает заметить, что&nbsp;с&nbsp;вами происходит, и&nbsp;выбрать следующий бережный шаг.</p>',
    '<div class="home-actions">',
    '<a class="home-primary" href="#recognition">начать историю <span aria-hidden="true">→</span></a>',
    '<p>Несколько минут. Можно остановиться в&nbsp;любой момент.</p>',
    '</div>',
    '</div>',
    '<figure class="home-stage" aria-label="Алиса и Игорь, герои интерактивной истории">',
    '<div class="home-stage__ellipse" aria-hidden="true"></div>',
    '<img class="home-stage__alice" src="/scenes/recognition/alice.png" alt="Алиса" />',
    '<img class="home-stage__igor" src="/scenes/recognition/igor.png" alt="Игорь" />',
    '</figure>',
    '</section>',
    '</main>',
  ].join('')
}
