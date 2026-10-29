import './style.css'
import { returnToPreviousAdvice, shouldRestoreAdvice } from '../../story-back.js'
import { completeQuestion, getSavedAnswers, saveSelection } from '../../result-data.js'

const asset = `${import.meta.env.BASE_URL}scenes/recognition/conversation/`
const phrases = [
  { id: 'promiseToStop', text: '«я больше не буду играть»', x: 15, y: 29 },
  { id: 'promiseToWinBack', text: '«я отыграюсь<br>и верну деньги»', x: 35, y: 21 },
  { id: 'earningClaim', text: '«на этом можно заработать»', x: 60, y: 22 },
  { id: 'systemClaim', text: '«у меня есть система»', x: 90, y: 23 },
  { id: 'controlClaim', text: '«я могу контролировать игру,<br>играть аккуратно»', x: 74, y: 35 },
  { id: 'entertainmentClaim', text: '«это просто развлечение»', x: 18, y: 45 },
  { id: 'easyMoneyClaim', text: '«это лёгкие деньги»', x: 86, y: 45 },
  { id: 'specialKnowledgeClaim', text: '«я знаю то,<br>чего не знают другие»', x: 16, y: 62 },
  { id: 'selfRelianceClaim', text: '«я сам справлюсь»', x: 80, y: 62 },
  { id: 'notDiscussed', text: 'мы ещё не говорили<br>об игре', x: 87, y: 72, exclusive: true },
]

const advice = `
  <div class="conversation-advice" role="dialog" aria-modal="true" aria-label="Что делать">
    <div class="conversation-advice__circle">
      <h2>что делать?</h2>
      <div class="conversation-advice__copy">
        <p>После признания можно спросить о конкретных<br class="conversation-desktop-break"> последствиях: сколько денег не хватает,<br class="conversation-desktop-break"> какие платежи предстоят, есть ли ещё долги.</p>
        <p>Скажите, как это затрагивает вас. Необязательно<br class="conversation-desktop-break"> за один разговор добиться обещания больше никогда<br class="conversation-desktop-break"> не играть: важнее понять, что происходит сейчас<br class="conversation-desktop-break"> и какой следующий шаг человек готов обсудить.</p>
      </div>
      <p class="conversation-advice__hint">подробнее о том, как поговорить с близким<br>можно прочитать в разделе помощи</p>
    </div>
    <button class="conversation-back conversation-back--advice" type="button" data-back="advice">назад</button>
    <a class="conversation-advice__next" href="#recognition/help">узнать, что было дальше</a>
  </div>`

export function renderConversation(app) {
  app.innerHTML = `
    <main class="conversation conversation--conversation" data-step="alice">
      <a class="conversation-home" href="#">на главную</a>
      <section class="conversation-screen conversation-alice" aria-label="Алиса хочет верить">
        <h2>хочет верить, но боится повторения</h2>
        <span class="conversation-person-name conversation-person-name--alice">Алиса</span>
        <img class="conversation-alice__figure" src="${asset}alice.png" alt="Алиса">
        <div class="conversation-story-circle conversation-story-circle--dark"><p>Не успела я собраться с мыслями,<br>как Игорь сам начал разговор.<br>Он признался, что проиграл деньги<br>на ставках, и пообещал прекратить.<br>Мне хотелось ему поверить,<br>но я боялась, что это повторится.</p></div>
        <button class="conversation-back" type="button" data-back="alice">назад</button>
        <button class="conversation-button conversation-alice__button" type="button" data-next="igor">послушать Игоря</button>
      </section>
      <section class="conversation-screen conversation-igor" aria-label="Игорь верит, что сможет остановиться">
        <h2>верит, что сможет остановиться</h2>
        <div class="conversation-story-circle conversation-story-circle--light"><p>Я сказал Алисе, что сделал пару<br>ставок и больше играть не буду.<br><br>О том, что уже крупно проиграл<br>и залез в долги, я промолчал. Тогда<br>я верил, что смогу остановиться сам.<br><br>Некоторое время я не играл, потом<br>снова начал ставить понемногу.<br>Постепенно суммы выросли,<br>и я опять проиграл много денег.</p></div>
        <img class="conversation-igor__figure" src="${asset}igor.png" alt="Игорь">
        <span class="conversation-person-name conversation-person-name--igor">Игорь</span>
        <button class="conversation-back" type="button" data-back="igor">назад</button>
        <button class="conversation-button conversation-igor__button" type="button" data-next="phrases">далее</button>
      </section>
      <section class="conversation-screen conversation-phrases" aria-label="Какие фразы от близкого вы слышали">
        <h2>какие фразы от близкого вы слышали?</h2>
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
  const savedSelection = getSavedAnswers()['conversation'].selected
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
  const restoringAdvice = shouldRestoreAdvice('#recognition/conversation')
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
        returnToPreviousAdvice('#recognition')
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
      saveSelection('conversation', [...scene.querySelectorAll('.conversation-phrase[aria-pressed="true"]')].map((item) => item.dataset.answerId))
      return
    }
    if (event.target.closest('.conversation-phrases__next')) {
      if (!scene.querySelector('.conversation-phrase[aria-pressed="true"]')) return
      completeQuestion('conversation')
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
