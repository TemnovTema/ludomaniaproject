import './style.css'

export function renderLanding(app) {
  app.innerHTML = [
    '<main class="home">',
    '<header class="home-header">',
    '<a class="home-brand" href="#menu" aria-label="Ставка на себя, на главную">ставка<br />на себя.</a>',
    '<nav class="home-nav" aria-label="Разделы проекта"><a href="#research">research</a></nav>',
    '<a class="home-header__story" href="#help">помощь</a>',
    '<details class="home-menu">',
    '<summary aria-label="Открыть меню"><span></span><span></span></summary>',
    '<nav aria-label="Разделы проекта"><a href="#research">research</a><a class="home-menu__story" href="#help">помощь</a></nav>',
    '</details>',
    '</header>',
    '<section id="menu" class="home-hero" aria-labelledby="home-title">',
    '<div class="home-hero__copy">',
    '<h1 id="home-title">близкий делает ставки,<br />а что делать вам?</h1>',
    '<p class="home-subtitle">для тех, чьи близкие играют в азартные игры</p>',
    '<p class="home-lead">обещания, долги, недоверие — игра близкого<br class="home-desktop-break" /> затрагивает и вас, взгляните на происходящее<br class="home-desktop-break" /> со стороны и узнайте, где искать поддержку для себя</p>',
    '<div class="home-actions">',
    '<a class="home-primary" href="#recognition">открыть историю</a>',
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
