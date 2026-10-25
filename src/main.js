const screens = [...document.querySelectorAll('[data-screen]')];
const homeScreen = document.querySelector('[data-screen="home"]');
const storyTrigger = document.querySelector('[data-section="story"]');
const contentScreen = document.querySelector('[data-screen="content"]');
const contentLayout = document.querySelector('#content-layout');
let storyOrb = null;
let storyBack = null;
let storySequence = null;

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

function startStoryTransition() {
  if (storyOrb) return;

  const bounds = storyTrigger.getBoundingClientRect();
  const finalDiameter = window.innerHeight;
  const shiftX = window.innerWidth / 2 - (bounds.left + bounds.width / 2);
  const shiftY = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
  const scale = finalDiameter / bounds.width;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  storyOrb = storyTrigger.cloneNode(true);
  storyOrb.classList.add('story-orb');
  storyOrb.removeAttribute('data-section');
  storyOrb.setAttribute('aria-hidden', 'true');
  storyOrb.style.setProperty('--story-shift-x', `${shiftX}px`);
  storyOrb.style.setProperty('--story-shift-y', `${shiftY}px`);
  storyOrb.style.setProperty('--story-scale', scale);
  storyOrb.style.left = `${bounds.left}px`;
  storyOrb.style.top = `${bounds.top}px`;
  storyOrb.style.width = `${bounds.width}px`;
  storyOrb.style.height = `${bounds.height}px`;
  storyOrb.insertAdjacentHTML('beforeend', `
    <div class="story-orb-copy">
      <p>История</p>
      <h1>Блок текста 1</h1>
    </div>
  `);

  storyBack = document.createElement('button');
  storyBack.className = 'story-back';
  storyBack.type = 'button';
  storyBack.textContent = 'назад';
  storyBack.addEventListener('click', goHome);

  document.body.append(storyOrb, storyBack);
  document.body.classList.add('is-story-transitioning');
  homeScreen.classList.add('is-story-transition');

  const expand = () => {
    storyOrb.classList.add('is-expanded');
    window.setTimeout(() => {
      storyOrb?.classList.add('is-ready');
      storyBack?.classList.add('is-ready');
      storyBack?.focus({ preventScroll: true });
      window.setTimeout(activateStorySequence, reduceMotion ? 0 : 240);
    }, reduceMotion ? 0 : 780);
  };

  window.setTimeout(expand, reduceMotion ? 0 : 380);
}

function activateStorySequence() {
  if (!storyOrb) return;

  storyOrb.remove();
  storyBack?.remove();
  storyOrb = null;
  storyBack = null;
  homeScreen.hidden = true;
  document.body.classList.remove('is-story-transitioning');
  document.body.classList.add('is-story-reading');

  storySequence = document.createElement('section');
  storySequence.className = 'story-sequence';
  storySequence.setAttribute('aria-label', 'История');
  const viewportHeight = window.innerHeight;
  const gap = Math.max(6, Math.min(window.innerWidth * 0.006, 10));
  const availableWidth = Math.max(viewportHeight * 0.34, window.innerWidth - viewportHeight - gap);
  const smallScale = Math.min(0.82, availableWidth / viewportHeight);
  const firstShift = availableWidth / 2 - window.innerWidth / 2 + viewportHeight;
  const secondShift = window.innerWidth / 2 - viewportHeight / 2;
  storySequence.style.setProperty('--small-scale', smallScale);
  storySequence.style.setProperty('--alice-copy-scale', 1 / smallScale);
  storySequence.style.setProperty('--first-shift-x', `${firstShift}px`);
  storySequence.style.setProperty('--second-shift-x', `${secondShift}px`);
  storySequence.innerHTML = `
    <div class="story-stage">
      <button class="story-back story-back--sequence" type="button">назад</button>
      <div class="story-track">
        <div class="story-disc story-disc--first">
          <div class="story-copy story-copy--one"><p>История</p><h1>Блок текста 1</h1></div>
          <div class="story-copy story-copy--two"><p>История</p><h1>Блок текста 2</h1></div>
          <div class="story-alice-copy">
            <p>Алиса, 25 лет</p>
            <p>Узнала, что у меня есть огромная семья<br />И тропинка, и лесок, в поле каждый колосок!</p>
          </div>
        </div>
        <div class="story-disc story-disc--second">
          <div class="story-disc-flip">
            <div class="story-disc-face story-disc-face--front">
              <img src="/story-couple.png" alt="Пара стоит рядом" />
            </div>
            <div class="story-disc-face story-disc-face--back">
              <img src="/story-alice.png" alt="Портрет Алисы" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  storySequence.querySelector('.story-back').addEventListener('click', goHome);
  document.querySelector('.page-shell').append(storySequence);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function goHome() {
  if (storyOrb) {
    storyOrb.remove();
    storyBack?.remove();
    storyOrb = null;
    storyBack = null;
    document.body.classList.remove('is-story-transitioning');
    homeScreen.classList.remove('is-story-transition');
  }

  if (storySequence) {
    storySequence.remove();
    storySequence = null;
    document.body.classList.remove('is-story-reading');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  showScreen('home');
  storyTrigger?.focus({ preventScroll: true });
}

document.querySelectorAll('[data-section]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.section === 'story') {
      startStoryTransition();
      return;
    }

    openSection(button.dataset.section);
  });
});
document.querySelectorAll('[data-home]').forEach((control) => {
  control.addEventListener('click', (event) => {
    event.preventDefault();
    goHome();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && storyOrb) {
    goHome();
    return;
  }
  if (event.key === 'Escape' && !homeScreen.hidden) return;
  if (event.key === 'Escape') goHome();
});
