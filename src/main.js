const screens = [...document.querySelectorAll('[data-screen]')];
const contentScreen = document.querySelector('[data-screen="content"]');
const contentLayout = document.querySelector('#content-layout');

const sections = {
  story: {
    eyebrow: 'История',
    title: 'Когда игра становится частью жизни семьи',
    imagePosition: '50% 0%',
    intro: 'Здесь позже появится история, собранная из эпизодов и голосов близких. Пока это спокойная точка входа без декоративного орнамента.',
    items: ['Что замечают близкие в самом начале.', 'Как меняются разговоры, деньги и доверие.', 'Почему обратиться за поддержкой можно до критической точки.'],
    note: 'Эту страницу продолжим после того, как определим формат истории.'
  },
  signs: {
    eyebrow: 'Как понять, что происходит',
    title: 'Признаки, которые нельзя оставлять без внимания',
    imagePosition: '0% 0%',
    intro: 'Проблема редко начинается с одного большого проигрыша. Чаще она постепенно занимает деньги, время и отношения.',
    items: ['Ставки становятся регулярными и скрытыми.', 'Появляются долги, просьбы одолжить деньги или исчезающие суммы.', 'Человек раздражается, когда тема игры всплывает в разговоре.'],
    note: 'Это не диагноз. Но это повод внимательно посмотреть на ситуацию и не оставаться с ней одному.'
  },
  actions: {
    eyebrow: 'Что делать сейчас',
    title: 'Не спасать в одиночку, а возвращать опору',
    imagePosition: '100% 0%',
    intro: 'В момент тревоги хочется срочно всё исправить. Начните с простых действий, которые защищают вас и делают разговор возможным.',
    items: ['Не отдавайте деньги на погашение ставок без общего плана.', 'Зафиксируйте факты: долги, кредиты, повторяющиеся просьбы.', 'Выберите спокойный момент для разговора, без обвинений и угроз.'],
    note: 'Если есть риск потери общих денег, сначала продумайте финансовые границы.'
  },
  conversation: {
    eyebrow: 'Как говорить с близким',
    title: 'Разговор начинается не с обвинения',
    imagePosition: '0% 100%',
    intro: 'Цель первого разговора не заставить человека признаться во всём. Важнее показать, что вы видите проблему и готовы обсуждать следующий шаг.',
    items: ['Говорите о наблюдениях: «Я вижу, что ты стал часто занимать деньги».', 'Не спорьте о каждой ставке. Возвращайтесь к тому, как игра влияет на жизнь.', 'Обозначьте границы: что вы готовы делать, а что не можете брать на себя.'],
    note: 'Фраза «я рядом, но не буду покрывать последствия игры» может быть честной и поддерживающей одновременно.'
  },
  'self-check': {
    eyebrow: 'Проверить ситуацию',
    title: 'Насколько ситуация похожа на проблему с игрой?',
    imagePosition: '100% 100%',
    intro: 'Этот короткий тест не ставит диагноз. Он помогает заметить, какие части ситуации уже требуют внимания.',
    items: ['Есть ли у вас тревога за общие деньги или долги?', 'Приходится ли скрывать проблему от друзей и семьи?', 'Были ли обещания остановиться, после которых игра продолжалась?'],
    note: 'Следующим шагом здесь появится тест с бережным результатом и рекомендациями.'
  },
  support: {
    eyebrow: 'Где искать помощь',
    title: 'Поддержка нужна не только тому, кто играет',
    imagePosition: '100% 100%',
    intro: 'Близкие часто остаются один на один с тревогой, стыдом и финансовыми последствиями. Помощь может начаться с простого разговора со специалистом.',
    items: ['Психолог или психотерапевт, который работает с зависимостями.', 'Группы поддержки для близких людей с игровой зависимостью.', 'Юридическая и финансовая консультация, если в семье есть долги или кредиты.'],
    note: 'Контакты проверенных сервисов и горячих линий добавим на следующем этапе.'
  }
};

function showScreen(name) {
  screens.forEach((screen) => { screen.hidden = screen.dataset.screen !== name; });
}

function openSection(name) {
  const section = sections[name];
  if (!section) return;

  contentLayout.innerHTML = `
    <div class="content-copy">
      <p class="content-eyebrow">${section.eyebrow}</p>
      <h1>${section.title}</h1>
      <p class="content-intro">${section.intro}</p>
      <ul class="content-list">${section.items.map((item) => `<li>${item}</li>`).join('')}</ul>
      <p class="content-note">${section.note}</p>
    </div>
    <figure class="content-image" style="--image-position: ${section.imagePosition}">
      <img src="/section-stories.png" alt="Документальная иллюстрация раздела" />
    </figure>
  `;

  showScreen('content');
  contentScreen.focus({ preventScroll: true });
}

function goHome() {
  showScreen('home');
  document.querySelector('[data-section="story"]')?.focus({ preventScroll: true });
}

document.querySelectorAll('[data-section]').forEach((button) => {
  button.addEventListener('click', () => openSection(button.dataset.section));
});
document.querySelectorAll('[data-home]').forEach((control) => {
  control.addEventListener('click', (event) => {
    event.preventDefault();
    goHome();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !document.querySelector('[data-screen="home"]').hidden) return;
  if (event.key === 'Escape') goHome();
});
