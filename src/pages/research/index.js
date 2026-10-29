import './style.css'
import { trackGoal } from '../../shared/metrica.js'

const situations = [
  {
    id: 'conversation',
    label: 'хочу поговорить, не знаю с чего начать',
    shortLabel: 'о разговоре',
    count: '15 из 20',
    metric: 'участников опроса сказали, что игра затронула отношения и чувство близости.',
    context: 'В разговорах часто остаются недоверие, обещания и попытки договориться о будущем.',
    action: 'Выберите один спокойный вопрос о том, что происходит сейчас. Не пытайтесь за один разговор получить обещание больше не играть.',
    link: '#conversation',
    linkLabel: 'перейти к разговору',
  },
  {
    id: 'money',
    label: 'из общего бюджета пропадают деньги',
    shortLabel: 'о деньгах',
    count: '18 из 20',
    metric: 'участников опроса отметили, что ситуация затронула деньги.',
    context: 'Просьбы закрыть долг могут превращаться в общую тревогу и попытки срочно спасти ситуацию.',
    action: 'Сначала проверьте факты: какие есть обязательные платежи, кто имеет доступ к счетам и как защитить ваши базовые расходы.',
    link: '#boundaries',
    linkLabel: 'перейти к границам',
  },
  {
    id: 'control',
    label: 'не могу перестать контролировать близкого',
    shortLabel: 'о контроле',
    count: '14 из 20',
    metric: 'участников отметили влияние ситуации на сон и эмоциональное состояние.',
    context: 'Постоянная проверка и ожидание нового срыва могут забирать силы, даже когда играете не вы.',
    action: 'Верните себе небольшую зону контроля: сон, личные деньги, время с близкими или разговор с тем, кому доверяете.',
    link: '#self-support',
    linkLabel: 'поддержать себя',
  },
  {
    id: 'support',
    label: 'нужна поддержка для себя',
    shortLabel: 'о поддержке',
    count: '6 из 20',
    metric: 'участников сейчас не получают никакой поддержки.',
    context: 'Люди ищут ответы в поиске, чатах и группах, но не всегда понимают, с чего начать.',
    action: 'Не ждите, пока станет совсем тяжело. Один разговор с психологом, группой поддержки или близким человеком уже может стать опорой.',
    link: '#help',
    linkLabel: 'найти помощь',
  },
  {
    id: 'debt',
    label: 'близкий просит закрыть долг',
    shortLabel: 'о долгах',
    count: '18 из 20',
    metric: 'участников назвали деньги одной из затронутых сфер жизни.',
    context: 'Помощь с долгом не всегда помогает с самой зависимостью и может поставить под угрозу вашу безопасность.',
    action: 'Дайте себе паузу перед финансовым решением. Не берите новый кредит и не обещайте деньги, пока не понимаете последствия для себя.',
    link: '#boundaries',
    linkLabel: 'разобраться с границами',
  },
  {
    id: 'help',
    label: 'не понимаю, где искать помощь',
    shortLabel: 'о помощи',
    count: '12 из 20',
    metric: 'участников искали ответы в чатах и онлайн-сообществах.',
    context: 'Найти первый безопасный источник помощи бывает трудно, особенно когда всё происходит одновременно.',
    action: 'Начните с одного проверенного контакта. Не нужно разбираться во всём сразу или искать идеальное решение за один вечер.',
    link: '#help',
    linkLabel: 'открыть помощь',
  },
]

function renderHeader() {
  return `
    <header class="research-header">
      <a class="research-header__utility" href="#menu">в меню</a>
      <a class="research-header__utility" href="#help">помощь</a>
    </header>
  `
}

function renderIntro() {
  return `
    <main class="research research--intro">
      <section class="research-stage" aria-labelledby="research-title">
        ${renderHeader()}
        <div class="research-stage__ellipse" aria-hidden="true"></div>
        <div class="research-intro">
          <h1 id="research-title">вы не одни в этой ситуации.<br>20 человек поделились<br>своим опытом</h1>
          <p>Выберите то, что беспокоит вас сейчас, и посмотрите, как с этим сталкивались другие близкие.</p>
          <div class="research-intro__actions">
            <button class="research-button research-button--lime" type="button" data-survey>принять участие в опросе</button>
            <button class="research-button research-button--outline" type="button" data-show-situations>узнать другие истории</button>
          </div>
          <p class="research-intro__notice" data-survey-notice aria-live="polite"></p>
        </div>
      </section>
    </main>
  `
}

function renderSituationChoice() {
  return `
    <main class="research research--choice">
      <section class="research-stage" aria-labelledby="situation-title">
        ${renderHeader()}
        <div class="research-stage__ellipse" aria-hidden="true"></div>
        <div class="research-choice">
          <button class="research-back" type="button" data-back-intro aria-label="Вернуться назад">←</button>
          <h1 id="situation-title">выберите то, с чем<br>столкнулись лично вы</h1>
          <p>Вы увидите, сколько участников опроса описали похожую ситуацию, и найдёте следующий шаг.</p>
          <div class="research-choice__filters" role="group" aria-label="Выберите ситуацию">
            ${situations.map((situation) => `
              <button class="research-filter" type="button" data-select-situation="${situation.id}">${situation.label}</button>
            `).join('')}
          </div>
        </div>
      </section>
    </main>
  `
}

function renderResult(situation) {
  return `
    <main class="research research--result">
      <section class="research-stage" aria-labelledby="result-title">
        ${renderHeader()}
        <div class="research-stage__ellipse" aria-hidden="true"></div>
        <div class="research-result__topline">
          <button class="research-back research-back--light" type="button" data-back-choice aria-label="Вернуться к выбору">←</button>
          <span>${situation.shortLabel}</span>
        </div>
        <div class="research-result">
          <h1 id="result-title"><strong>${situation.count}</strong><br>${situation.metric}</h1>
          <p class="research-result__context">${situation.context}</p>
        </div>
        <aside class="research-action" aria-label="Что можно сделать">
          <h2>что можно<br>сделать?</h2>
          <p>${situation.action}</p>
          <a href="${situation.link}">${situation.linkLabel} <span aria-hidden="true">↗</span></a>
        </aside>
      </section>
    </main>
  `
}

export function renderResearch(app) {
  let screen = 'intro'
  let activeSituation = situations[0]

  const render = () => {
    if (screen === 'choice') app.innerHTML = renderSituationChoice()
    else if (screen === 'result') app.innerHTML = renderResult(activeSituation)
    else app.innerHTML = renderIntro()

    app.querySelector('[data-show-situations]')?.addEventListener('click', () => {
      trackGoal('open_research_situations')
      screen = 'choice'
      render()
    })

    app.querySelector('[data-back-intro]')?.addEventListener('click', () => {
      screen = 'intro'
      render()
    })

    app.querySelector('[data-back-choice]')?.addEventListener('click', () => {
      screen = 'choice'
      render()
    })

    app.querySelectorAll('[data-select-situation]').forEach((button) => {
      button.addEventListener('click', () => {
        trackGoal('research_topic_selected')
        activeSituation = situations.find((situation) => situation.id === button.dataset.selectSituation)
        screen = 'result'
        render()
      })
    })

    app.querySelector('[data-survey]')?.addEventListener('click', () => {
      trackGoal('survey_interest')
      app.querySelector('[data-survey-notice]').textContent = 'Ссылка на анонимный опрос появится здесь после подключения Google Form.'
    })
  }

  render()
}
