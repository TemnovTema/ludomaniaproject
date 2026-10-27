import './style.css'

function rings(count, className = '') {
  return `<span class="pattern ${className}" aria-hidden="true">${Array.from(
    { length: count },
    () => '<i></i>',
  ).join('')}</span>`
}

function patternMarkup(pattern) {
  if (pattern === 'six-rings') return rings(6, 'pattern--six')
  if (pattern === 'wave-rings') return rings(7, 'pattern--wave')
  if (pattern === 'flower-rings') return rings(6, 'pattern--flower')
  if (pattern === 'vesica-rings') return rings(3, 'pattern--vesica')
  return ''
}

function menuLink(section) {
  const label = section.title.replace('\n', '<br />')

  return [
    '<a class="menu-orb menu-orb--', section.tone,
    '" href="#', section.id,
    '" aria-label="', section.title.replace('\n', ' '), '">',
    patternMarkup(section.pattern),
    '<span class="menu-orb__label">', label, '</span>',
    '</a>',
  ].join('')
}

export function renderLanding(app, sections) {
  app.innerHTML = [
    '<main class="start-screen">',
    '<header class="start-header">',
    '<p class="project-name">ставка<br />на себя.</p>',
    '<a class="brand-mark" href="#menu" aria-label="О лудомании, к меню">',
    '<svg viewBox="0 0 260 92" role="img" aria-hidden="true">',
    '<path d="M46 8C19 8 4 29 4 49s15 35 42 35c27 0 36-21 55-21s28 21 55 21c27 0 42-15 42-35S183 8 156 8c-27 0-36 21-55 21S73 8 46 8Z" />',
    '</svg><span>о лудомании</span></a>',
    '<nav class="utility-nav" aria-label="Сервисная навигация">',
    '<button type="button">тест</button><button type="button">помощь</button>',
    '</nav></header>',
    '<section id="menu" class="menu-grid" aria-label="Разделы проекта">',
    sections.map(menuLink).join(''),
    '</section>',
    '<p class="screen-note">узнай, где найти поддержку,<br />если твой близкий играет в азартные игры</p>',
    '</main>',
  ].join('')
}
