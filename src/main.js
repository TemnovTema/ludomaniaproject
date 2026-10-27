const screens = [...document.querySelectorAll('[data-screen]')];
const homeScreen = document.querySelector('[data-screen="home"]');
const storyTrigger = document.querySelector('[data-section="story"]');
const contentScreen = document.querySelector('[data-screen="content"]');
const contentLayout = document.querySelector('#content-layout');
let storyOrb = null;
let storyBack = null;
let storySequence = null;
let diceObserver = null;

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
      activateStorySequence();
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
  const firstShiftAlice = availableWidth / 2 - window.innerWidth / 2 + viewportHeight;
  const firstShiftIgor = window.innerWidth / 2 + viewportHeight - availableWidth / 2;
  const secondShiftAlice = window.innerWidth / 2 - viewportHeight / 2;
  const secondShiftIgor = viewportHeight / 2 - window.innerWidth / 2;
  const endingScale = .24;
  const compactSize = viewportHeight * endingScale;
  const compactGap = Math.max(4, Math.min(window.innerWidth * .005, 8));
  const endingY = (viewportHeight - compactSize) / 2;
  const firstShiftEnding = viewportHeight + compactSize / 2 + compactGap / 2;
  const secondShiftEnding = -compactSize / 2 - compactGap / 2;
  const firstShiftSeparated = viewportHeight + window.innerWidth * .25;
  const secondShiftSeparated = -window.innerWidth * .25;
  storySequence.style.setProperty('--small-scale', smallScale);
  storySequence.style.setProperty('--ending-scale', endingScale);
  storySequence.style.setProperty('--alice-copy-scale', 1 / smallScale);
  storySequence.style.setProperty('--first-shift-alice', `${firstShiftAlice}px`);
  storySequence.style.setProperty('--first-shift-igor', `${firstShiftIgor}px`);
  storySequence.style.setProperty('--second-shift-alice', `${secondShiftAlice}px`);
  storySequence.style.setProperty('--second-shift-igor', `${secondShiftIgor}px`);
  storySequence.style.setProperty('--first-shift-ending', `${firstShiftEnding}px`);
  storySequence.style.setProperty('--second-shift-ending', `${secondShiftEnding}px`);
  storySequence.style.setProperty('--ending-y', `${endingY}px`);
  storySequence.style.setProperty('--first-shift-separated', `${firstShiftSeparated}px`);
  storySequence.style.setProperty('--second-shift-separated', `${secondShiftSeparated}px`);
  storySequence.innerHTML = `
    <div class="story-stage">
      <button class="story-back story-back--sequence" type="button">назад</button>
      <p class="story-ending-hint">Кликните на персонажей, по очереди</p>
      <div class="story-question-layer" aria-label="Вопрос о переменах">
        <div class="question-orb question-orb--alice">
          <img src="/story-alice.png" alt="Портрет Алисы" />
        </div>
        <div class="question-orb question-orb--igor"><img src="/story-igor.png" alt="Портрет Игоря" /><p>Какие перемены вы заметили?</p></div>
        <div class="question-orb question-orb--die" aria-label="Варианты ответа">
          <div class="question-options">
            <button type="button" aria-pressed="false"><span>Близкий стал чаще сидеть<br />в телефоне, днём и ночью</span></button>
            <button type="button" aria-pressed="false"><span>Пропали общие деньги или<br />появились расходы, о<br />которых я не знал(а)</span></button>
            <button type="button" aria-pressed="false"><span>Он стал раздражительнее<br />или реже отвечать на<br />обычные вопросы</span></button>
            <button type="button" aria-pressed="false"><span>Он начал скрывать траты<br />или уходить от вопросов<br />о деньгах</span></button>
            <button type="button" aria-pressed="false"><span>Другое</span></button>
          </div>
        </div>
      </div>
      <div class="story-track">
        <div class="story-disc story-disc--first">
          <div class="story-copy story-copy--one">
            <p>История</p>
            <h1>Блок текста 1</h1>
            <p class="story-body">Сначала я думала, что это просто сложный период.<br />Но вопросы о деньгах и исчезающие вечера<br />стали повторяться слишком часто.<br />Тогда я начала искать объяснение.</p>
          </div>
          <div class="story-copy story-copy--two">
            <p>История</p>
            <h1>Блок текста 2</h1>
            <p class="story-body">Я узнала, что зависимость касается не одного человека.<br />Она меняет разговоры, планы и чувство безопасности.<br />И всё же можно не оставаться с этим в одиночку.<br />Первый шаг начинается с признания происходящего.</p>
          </div>
          <div class="story-alice-copy">
            <p>Алиса, 25 лет</p>
            <p>Узнала, что у меня есть огромная семья<br />И тропинка, и лесок, в поле каждый колосок!</p>
          </div>
          <div class="story-igor-copy">
            <p>Игорь, 25 лет</p>
            <p>Узнал, что у меня есть огромная семья<br />И тропинка, и лесок, в поле каждый колосок!</p>
          </div>
          <div class="story-disc-image story-disc-image--alice">
            <img src="/story-alice.png" alt="Портрет Алисы" />
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
            <div class="story-disc-face story-disc-face--igor">
              <img src="/story-igor.png" alt="Портрет Игоря" />
            </div>
          </div>
        </div>
        <div class="story-disc story-disc--problem" aria-hidden="true">
          <div class="story-problem-die">
            <span class="story-dot-set story-dot-set--one"><i style="--x:50%;--y:50%"></i></span>
            <span class="story-dot-set story-dot-set--two"><i style="--x:50%;--y:32%"></i><i style="--x:50%;--y:68%"></i></span>
            <span class="story-dot-set story-dot-set--three"><i style="--x:30%;--y:30%"></i><i style="--x:50%;--y:50%"></i><i style="--x:70%;--y:70%"></i></span>
            <span class="story-dot-set story-dot-set--four"><i style="--x:30%;--y:30%"></i><i style="--x:70%;--y:30%"></i><i style="--x:30%;--y:70%"></i><i style="--x:70%;--y:70%"></i></span>
            <span class="story-dot-set story-dot-set--five"><i style="--x:30%;--y:30%"></i><i style="--x:70%;--y:30%"></i><i style="--x:50%;--y:50%"></i><i style="--x:30%;--y:70%"></i><i style="--x:70%;--y:70%"></i></span>
            <span class="story-dot-set story-dot-set--six"><i style="--x:30%;--y:26%"></i><i style="--x:70%;--y:26%"></i><i style="--x:30%;--y:50%"></i><i style="--x:70%;--y:50%"></i><i style="--x:30%;--y:74%"></i><i style="--x:70%;--y:74%"></i></span>
          </div>
        </div>
      </div>
    </div>
    <span class="story-dice-trigger" aria-hidden="true"></span>
  `;

  storySequence.querySelector('.story-back').addEventListener('click', goHome);
  storySequence.querySelectorAll('.question-options button').forEach((choice) => {
    choice.addEventListener('click', () => {
      storySequence.querySelectorAll('.question-options button').forEach((item) => {
        const selected = item === choice;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
    });
  });
  document.querySelector('.page-shell').append(storySequence);
  const diceTrigger = storySequence.querySelector('.story-dice-trigger');
  diceObserver?.disconnect();
  diceObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    storySequence?.classList.add('is-counting-dots');
    diceObserver?.disconnect();
    diceObserver = null;
  });
  diceObserver.observe(diceTrigger);
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
    diceObserver?.disconnect();
    diceObserver = null;
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
