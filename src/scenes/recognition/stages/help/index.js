import './style.css'
import { returnToPreviousAdvice, shouldRestoreAdvice } from '../../story-back.js'
import { completeQuestion, getSavedAnswers, saveSelection } from '../../result-data.js'

const asset = `${import.meta.env.BASE_URL}scenes/recognition/help/`
const phrases = [
  { id: 'talkedAboutGame', text: 'говорил(а) с близким об игре<br>и просил(а) остановиться', x: 50, y: 21 },
  { id: 'gaveMoneyOrCredit', text: 'давал(а) деньги, закрывал(а) долги<br>или брал(а) для этого кредит', x: 18, y: 34 },
  { id: 'soughtSpecialist', text: 'искал(а) для него специалиста<br>или группу поддержки', x: 78, y: 34 },
  { id: 'involvedFamily', text: 'обращался(ась) к другим близким,<br>чтобы вместе решить, что делать.', x: 17, y: 60 },
  { id: 'checkedExpensesOrPhone', text: 'проверял(а) его расходы,<br>телефон или игровые приложения', x: 82, y: 60 },
  { id: 'none', text: 'ничего из перечисленного', x: 18, y: 77, exclusive: true },
]

const advice = `
  <div class="conversation-advice" role="dialog" aria-modal="true" aria-label="Что делать">
    <div class="conversation-advice__circle">
      <h2>что делать?</h2>
      <div class="conversation-advice__copy">
        <p>Желание немедленно помочь с долгами понятно:<br class="conversation-desktop-break"> вам хочется обезопасить свою семью. Прежде чем<br class="conversation-desktop-break"> передавать деньги или брать кредит, выясните, какие<br class="conversation-desktop-break"> обязательства оформлены на вас и чем вы будете<br class="conversation-desktop-break"> оплачивать собственные необходимые расходы.</p>
        <p>Если близкий готов участвовать, можно вместе собрать<br class="conversation-desktop-break"> сведения о его задолженностях и обратиться<br class="conversation-desktop-break"> за финансовой консультацией — без обещания<br class="conversation-desktop-break"> погасить их за него.</p>
      </div>
      <p class="conversation-advice__hint">подробнее о том, как безопасно помочь близкому<br>можно прочитать в разделе помощи</p>
    </div>
    <button class="conversation-back conversation-back--advice" type="button" data-back="advice">назад</button>
    <a class="conversation-advice__next" href="#recognition/self-support">узнать, что было дальше</a>
  </div>`

export function renderHelp(app) {
  app.innerHTML = `
    <main class="conversation conversation--help" data-step="alice">
      <a class="conversation-home" href="#">на главную</a>
      <section class="conversation-screen conversation-alice" aria-label="Алиса хочет помочь, пока не выросли долги">
        <h2>хочет помочь, пока не выросли долги</h2>
        <span class="conversation-person-name conversation-person-name--alice">Алиса</span>
        <img class="conversation-alice__figure" src="${asset}alice.png" alt="Алиса">
        <div class="conversation-story-circle conversation-story-circle--dark"><p>Я думала, что Игорь проиграл только<br>наши накопления, но вскоре узнала<br>о других долгах и просрочках.<br><br>Я пыталась говорить с ним<br>об игре и искала специалиста,<br>а он настаивал, что сначала нужно<br>закрыть долги, и снова обещал<br>остановиться.<br><br>В итоге я взяла кредит, решив,<br>что с игрой мы разберёмся потом.</p></div>
        <button class="conversation-back" type="button" data-back="alice">назад</button>
        <button class="conversation-button conversation-alice__button" type="button" data-next="igor">послушать Игоря</button>
      </section>
      <section class="conversation-screen conversation-igor" aria-label="Игорь надеется отыграться и все вернуть">
        <h2>надеется отыграться и все вернуть</h2>
        <div class="conversation-story-circle conversation-story-circle--light"><p>Мне казалось, что пока мы ищем<br>специалиста, проценты будут расти,<br>поэтому я и попросил Алису помочь.<br><br>Часть денег я отдал кредиторам,<br>остальное оставил на другие платежи.<br><br>Несколько недель я не играл,<br>но потом снова начал ставить:<br>надеялся выиграть и быстрее вернуть<br>Алисе деньги. Но я снова проиграл.</p></div>
        <img class="conversation-igor__figure" src="${asset}igor.png" alt="Игорь">
        <span class="conversation-person-name conversation-person-name--igor">Игорь</span>
        <button class="conversation-back" type="button" data-back="igor">назад</button>
        <button class="conversation-button conversation-igor__button" type="button" data-next="phrases">далее</button>
      </section>
      <section class="conversation-screen conversation-phrases" aria-label="Что вы делали, когда узнали об игре и ее последствиях">
        <h2>что вы делали, когда узнали<br>об игре и ее последствиях?</h2>
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
  const savedSelection = getSavedAnswers()['help'].selected
  scene.querySelectorAll('.conversation-phrase').forEach((item) => {
    item.setAttribute('aria-pressed', String(savedSelection.includes(item.dataset.answerId)))
  })
  scene.classList.toggle('conversation--has-selection', savedSelection.length > 0)
  let step = 'alice'
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
  const restoringAdvice = shouldRestoreAdvice('#recognition/help')
  if (restoringAdvice) {
    step = 'phrases'
    scene.dataset.step = 'phrases'
    scene.classList.add('conversation--submitted')
    showAdvice()
  }
  if (!restoringAdvice) {
    revealTimer = window.setTimeout(() => scene.classList.add('conversation--ready'), 1550)
  }
  scene.addEventListener('click', (event) => {
    const back = event.target.closest('[data-back]')
    if (back) {
      if (back.dataset.back === 'alice') {
        returnToPreviousAdvice('#recognition/conversation')
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
      saveSelection('help', [...scene.querySelectorAll('.conversation-phrase[aria-pressed="true"]')].map((item) => item.dataset.answerId))
      return
    }
    if (event.target.closest('.conversation-phrases__next')) {
      if (!scene.querySelector('.conversation-phrase[aria-pressed="true"]')) return
      completeQuestion('help')
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
