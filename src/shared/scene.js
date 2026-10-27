export function createSceneMarkup({ id, title, description }) {
  return [
    '<main class="scene scene--', id, '">',
    '<a class="scene__back" href="#menu">← к меню</a>',
    '<section class="scene__content">',
    '<p class="scene__eyebrow">сцена</p>',
    '<h1>', title, '</h1>',
    '<p>', description, '</p>',
    '</section>',
    '</main>',
  ].join('')
}

