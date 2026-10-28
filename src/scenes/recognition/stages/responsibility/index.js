import './style.css'
import { returnToPreviousAdvice, shouldRestoreAdvice } from '../../story-back.js'
import { completeQuestion, getResultModel, getSavedAnswers, saveSelection } from '../../result-data.js'
import { renderResultScreen } from '../../result-screen.js'

const asset = '/scenes/recognition/responsibility/'
const phrases = [
  { id: 'stopPayingDebts', text: 'как сказать близкому,<br>что я больше не буду<br>оплачивать его долги', x: 25, y: 28 },
  { id: 'supportForSelf', text: 'где получить поддержку для себя', x: 57, y: 22 },
  { id: 'suggestHelp', text: 'как предложить близкому<br>обратиться за помощью,<br>если решение остаётся за ним', x: 77, y: 34 },
  { id: 'ownDebt', text: 'что делать с долгом или кредитом,<br>который оформлен на меня', x: 18, y: 49 },
  { id: 'relationshipTerms', text: 'как понять, на каких условиях<br>я готов(а) продолжать наши отношения', x: 84, y: 59 },
  { id: 'protectOwnMoney', text: 'как защитить свои деньги<br>и сохранить средства<br>на необходимые расходы', x: 18, y: 68 },
  { id: 'unsureWhereToStart', text: 'пока не знаю, с чего начать', x: 86, y: 68, exclusive: true },
]

const advice = `
  <div class="conversation-advice" role="dialog" aria-modal="true" aria-label="Что делать">
    <div class="conversation-advice__circle">
      <h2>что делать?</h2>
      <div class="conversation-advice__copy">
        <p>Граница описывает ваши действия: например,<br class="conversation-desktop-break"> «я не буду давать деньги», или «я не буду давать деньги<br class="conversation-desktop-break"> напрямую, но буду оплачивать специалиста или<br class="conversation-desktop-break"> учёбу», или «я продолжу разговор, когда мы оба<br class="conversation-desktop-break"> сможем говорить спокойно».</p>
        <p>Вы можете предложить контакт специалиста<br class="conversation-desktop-break"> и поддержать решение близкого обратиться к нему.<br class="conversation-desktop-break"> Принять это решение и работать над изменениями<br class="conversation-desktop-break"> может только он сам; вам не нужно откладывать<br class="conversation-desktop-break"> собственную жизнь до этого момента.</p>
      </div>
      <p class="conversation-advice__hint">подробнее о том, как определить свои границы<br>и разделить ответственность можно<br>прочитать в разделе помощи</p>
    </div>
    <button class="conversation-back conversation-back--advice" type="button" data-back="advice">назад</button>
    <button class="conversation-advice__next" type="button">а что теперь?</button>
  </div>`

export function renderResponsibility(app) {
  app.innerHTML = `
    <main class="conversation conversation--responsibility" data-step="intro">
      <section class="conversation-screen conversation-intro" aria-label="Кто за что отвечает">
        <h1>кто за что отвечает?</h1>
        <div class="conversation-intro__portraits">
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}alice-portrait.jpg" alt="Портрет Алисы"></div></div>
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}igor-portrait.jpg" alt="Портрет Игоря"></div></div>
        </div>
        <p class="conversation-scroll-hint">скролльте вниз</p>
        <button class="conversation-back conversation-back--intro" type="button" data-back="intro" aria-label="Назад"><svg viewBox="0 0 34 22" width="34" height="22" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M33 11H1m0 0 9-9m-9 9 9 9"/></svg></button>
      </section>
      <section class="conversation-screen conversation-alice" aria-label="Алиса боится обозначения границ">
        <h2>боится обозначения границ</h2>
        <span class="conversation-person-name conversation-person-name--alice">Алиса</span>
        <img class="conversation-alice__figure" src="${asset}alice.png" alt="Алиса">
        <div class="conversation-story-circle conversation-story-circle--dark"><p>Психологу я впервые<br>сказала вслух, как боюсь за наше<br>с Игорем будущее и как трудно мне<br>стало ему доверять.<br><br>Я злилась на него, но по-прежнему<br>любила и потому казалось, что<br>решение разделить финансы ещё<br>сильнее нас отдалит. После долгих<br>сомнений я всё же перевела свои<br>деньги на отдельный счёт и сказала,<br>что больше не буду закрывать<br>его долги, но готова быть рядом<br>и помочь найти специалиста,<br>если он захочет обратиться.</p></div>
        <button class="conversation-back" type="button" data-back="alice">назад</button>
        <button class="conversation-button conversation-alice__button" type="button" data-next="igor">послушать Игоря</button>
      </section>
      <section class="conversation-screen conversation-igor" aria-label="Игорь видит в ее решении недоверие к себе">
        <h2>видит в ее решении недоверие к себе</h2>
        <div class="conversation-story-circle conversation-story-circle--light"><p>Меня разозлило, что Алиса<br>отделила свои деньги: будто решила,<br>что я опять всё проиграю.<br><br>Она предложила помочь найти<br>специалиста, и я видел, что мы всё<br>больше отдаляемся. Я не хотел этого,<br>но и рассказывать постороннему<br>человеку о долгах, ещё и платя<br>за консультацию, не был готов.<br><br>Мне казалось, что проблема<br>не настолько серьёзная: я сам<br>разберусь с долгами, а дальше<br>смогу играть аккуратнее.</p></div>
        <img class="conversation-igor__figure" src="${asset}igor.png" alt="Игорь">
        <span class="conversation-person-name conversation-person-name--igor">Игорь</span>
        <button class="conversation-back" type="button" data-back="igor">назад</button>
        <button class="conversation-button conversation-igor__button" type="button" data-next="phrases">далее</button>
      </section>
      <section class="conversation-screen conversation-phrases" aria-label="С какими вопросами вам сейчас хотелось бы разобраться">
        <h2>с какими вопросами вам сейчас<br>хотелось бы разобраться?</h2>
        <p class="conversation-phrases__hint">можно выбрать несколько вариантов</p>
        <div class="conversation-phrases__field">
          ${phrases.map((phrase, index) => `<button class="conversation-phrase" type="button" aria-pressed="false" style="--x:${phrase.x}%;--y:${phrase.y}%;--i:${index}" data-phrase="${index}" data-answer-id="${phrase.id}"${phrase.exclusive ? ' data-exclusive="true"' : ''}>${phrase.text}</button>`).join('')}
          <img class="conversation-phrases__figure" src="${asset}alice-igor.png" alt="">
        </div>
        <button class="conversation-button conversation-phrases__next" type="button">далее</button>
        <button class="conversation-back" type="button" data-back="phrases">назад</button>
        <button class="conversation-button conversation-phrases__advice" type="button">что делать?</button>
      </section>
    </main>`

  const scene = app.querySelector('.conversation')
  const savedSelection = getSavedAnswers()['responsibility'].selected
  scene.querySelectorAll('.conversation-phrase').forEach((item) => {
    item.setAttribute('aria-pressed', String(savedSelection.includes(item.dataset.answerId)))
  })
  scene.classList.toggle('conversation--has-selection', savedSelection.length > 0)
  let step = 'intro'
  let revealTimer
  let transitionTimer
  let adviceRevealTimer
  const restoreQuiz = () => {
    scene.querySelectorAll('.conversation-phrase').forEach((item) => {
      item.innerHTML = phrases[Number(item.dataset.phrase)].text
      item.removeAttribute('aria-label')
    })
    scene.classList.remove('conversation--submitted')
  }
  const setStep = (next) => {
    if (scene.classList.contains('conversation--transitioning') || step === next) return
    clearTimeout(revealTimer)
    scene.classList.remove('conversation--ready')
    scene.classList.add('conversation--transitioning')
    scene.dataset.nextStep = next
    clearTimeout(transitionTimer)
    transitionTimer = window.setTimeout(() => {
      step = next
      scene.dataset.step = next
      scene.classList.remove('conversation--transitioning')
      delete scene.dataset.nextStep
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (next === 'alice' || next === 'igor') {
        revealTimer = window.setTimeout(() => scene.classList.add('conversation--ready'), 1550)
      }
    }, 750)
  }
  const showAdvice = () => {
    scene.insertAdjacentHTML('beforeend', advice)
    const advicePanel = scene.querySelector('.conversation-advice')
    requestAnimationFrame(() => advicePanel?.classList.add('is-open'))
    clearTimeout(adviceRevealTimer)
    adviceRevealTimer = window.setTimeout(() => advicePanel?.classList.add('is-ready'), 1550)
  }
  if (shouldRestoreAdvice('#recognition/responsibility')) {
    step = 'phrases'
    scene.dataset.step = 'phrases'
    scene.classList.add('conversation--submitted')
    showAdvice()
  }
  const onScroll = () => {
    if (step === 'intro' && window.scrollY > 35) setStep('alice')
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  scene.addEventListener('wheel', (event) => {
    if (step === 'intro' && event.deltaY > 10) setStep('alice')
  }, { passive: true })
  let touchStartY = 0
  scene.addEventListener('touchstart', (event) => { touchStartY = event.touches[0]?.clientY || 0 }, { passive: true })
  scene.addEventListener('touchend', (event) => {
    if (step === 'intro' && touchStartY - (event.changedTouches[0]?.clientY || 0) > 35) setStep('alice')
  }, { passive: true })
  scene.addEventListener('click', (event) => {
    if (event.target.closest('.conversation-advice__next')) {
      const result = getResultModel()
      if (result.ready) renderResultScreen(app, result)
      return
    }
    const back = event.target.closest('[data-back]')
    if (back) {
      if (back.dataset.back === 'intro') {
        returnToPreviousAdvice('#recognition/self-support')
      } else if (back.dataset.back === 'alice') {
        setStep('intro')
      } else if (back.dataset.back === 'igor') {
        setStep('alice')
      } else if (back.dataset.back === 'phrases') {
        restoreQuiz()
        setStep('igor')
      } else if (back.dataset.back === 'advice') {
        clearTimeout(adviceRevealTimer)
        scene.querySelector('.conversation-advice')?.remove()
        restoreQuiz()
      }
      return
    }
    const next = event.target.closest('[data-next]')
    if (next) { setStep(next.dataset.next); return }
    const phrase = event.target.closest('.conversation-phrase')
    if (phrase && !scene.classList.contains('conversation--submitted')) {
      const selected = phrase.getAttribute('aria-pressed') !== 'true'
      if (selected) {
        if (phrase.dataset.exclusive === 'true') {
          scene.querySelectorAll('.conversation-phrase[aria-pressed="true"]').forEach((item) => item.setAttribute('aria-pressed', 'false'))
        } else {
          scene.querySelector('.conversation-phrase[data-exclusive="true"]')?.setAttribute('aria-pressed', 'false')
        }
      }
      phrase.setAttribute('aria-pressed', String(selected))
      scene.classList.toggle('conversation--has-selection', !!scene.querySelector('.conversation-phrase[aria-pressed="true"]'))
      saveSelection('responsibility', [...scene.querySelectorAll('.conversation-phrase[aria-pressed="true"]')].map((item) => item.dataset.answerId))
      return
    }
    if (event.target.closest('.conversation-phrases__next')) {
      if (!scene.querySelector('.conversation-phrase[aria-pressed="true"]')) return
      completeQuestion('responsibility')
      scene.querySelectorAll('.conversation-phrase[aria-pressed="false"]').forEach((item) => {
        const label = item.innerHTML.replaceAll('<br>', '\n').replace(/<[^>]+>/g, '')
        item.setAttribute('aria-label', label.replaceAll('\n', ' '))
        item.innerHTML = [...label].map((character, index) => {
          if (character === '\n') return '<br aria-hidden="true">'
          const dx = ((index * 37 + Number(item.dataset.phrase) * 19) % 91) - 45
          const dy = ((index * 53 + Number(item.dataset.phrase) * 29) % 111) - 55
          const rotation = ((index * 23) % 61) - 30
          return `<span class="conversation-phrase__letter" aria-hidden="true" style="--dx:${dx}px;--dy:${dy}px;--rot:${rotation}deg;--delay:${(index % 9) * 45}ms">${character === ' ' ? '&nbsp;' : character}</span>`
        }).join('')
      })
      scene.classList.add('conversation--submitted')
      return
    }
    if (event.target.closest('.conversation-phrases__advice')) {
      showAdvice()
      return
    }
  })
}
