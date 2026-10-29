import './style.css'
import { returnToPreviousAdvice, shouldRestoreAdvice } from './story-back.js'
import { completeQuestion, getSavedAnswers, resetStoryAnswers, saveSelection } from './result-data.js'

window.addEventListener('hashchange', (event) => {
  const previous = new URL(event.oldURL).hash
  const next = new URL(event.newURL).hash
  if (next === '#recognition' && (previous === '#menu' || previous === '')) {
    resetStoryAnswers()
  }
})

const asset = `${import.meta.env.BASE_URL}scenes/recognition/`
const phrases = [
  { id: 'changedMood', text: 'стал заметно более расстроенным,<br>чем обычно, но не говорит, что случилось', x: 34, y: 19 },
  { id: 'irritability', text: 'он стал раздражительнее или резче<br>отвечать на обычные вопросы', x: 19, y: 36 },
  { id: 'hiddenSpending', text: 'он начал скрывать траты<br>или уходить от вопросов о деньгах', x: 74, y: 34 },
  { id: 'missingSharedMoney', text: 'пропали общие деньги<br>или появились расходы, о которых<br>я не знал(а)', x: 83, y: 55 },
  { id: 'morePhoneTime', text: 'близкий стал чаще сидеть<br>в телефоне, в том числе ночью', x: 18, y: 67 },
  { id: 'none', text: 'ничего из перечисленного', x: 64, y: 20, exclusive: true },
]

const advice = `
  <div class="conversation-advice" role="dialog" aria-modal="true" aria-label="Что делать">
    <div class="conversation-advice__circle">
      <h2>что делать?</h2>
      <div class="conversation-advice__copy">
        <p>У перемен могут быть разные причины.<br class="conversation-desktop-break"> Пока вы не знаете, что произошло, отделите факты<br class="conversation-desktop-break"> от догадок: какие расходы вызывают вопросы, хватает<br class="conversation-desktop-break"> ли денег на общие платежи и насколько открыто<br class="conversation-desktop-break"> близкий говорит с вами о финансах. Если затронуты<br class="conversation-desktop-break"> ваши деньги, проверьте счета, к которым у вас есть<br class="conversation-desktop-break"> доступ, и позаботьтесь о сохранности своих средств.</p>
      </div>
      <p class="conversation-advice__hint">подробнее о том, как поговорить с близким<br>можно прочитать в разделе помощи</p>
    </div>
    <button class="conversation-back conversation-back--advice" type="button" data-back="advice">назад</button>
    <a class="conversation-advice__next" href="#recognition/conversation">узнать, что было дальше</a>
  </div>`

export function renderRecognition(app) {
  app.innerHTML = `
    <main class="conversation conversation--recognition" data-step="intro">
      <a class="conversation-home" href="#">на главную</a>
      <section class="conversation-screen conversation-intro" aria-label="Перед началом истории">
        <h1>перед началом истории</h1>
        <div class="conversation-intro__person conversation-intro__person--alice">
          <div class="conversation-intro__ring"><img src="${asset}alice-portrait.jpg" alt="Портрет Алисы"></div>
          <span>близкий</span>
        </div>
        <div class="conversation-intro__disclaimer">
          <p>История создана на основе интервью<br>с людьми, чьи близкие столкнулись<br>с игровой зависимостью.</p>
          <p>Она объединяет повторяющиеся ситуации<br>и переживания и не воспроизводит историю<br>одного конкретного человека или пары,<br>а ее герои — собирательные образы игрока<br>и его близкого.</p>
          <p>Весь материал подготовлен<br>под редакцией клинического психолога.</p>
        </div>
        <div class="conversation-intro__person conversation-intro__person--igor">
          <div class="conversation-intro__ring"><img src="${asset}igor-portrait.jpg" alt="Портрет Игоря"></div>
          <span>игрок</span>
        </div>
        <p class="conversation-scroll-hint">скролльте вниз</p>
        <button class="conversation-back conversation-back--intro" type="button" data-back="intro" aria-label="Назад"><svg viewBox="0 0 34 22" width="34" height="22" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M33 11H1m0 0 9-9m-9 9 9 9"/></svg></button>
      </section>
      <section class="conversation-screen conversation-alice" aria-label="Алиса заметила изменения">
        <h2>заметила изменения</h2>
        <span class="conversation-person-name conversation-person-name--alice">Алиса</span>
        <img class="conversation-alice__figure" src="${asset}alice.png" alt="Алиса">
        <div class="conversation-story-circle conversation-story-circle--dark"><p>Игорь стал раздражительным, поздно<br>ложился и подолгу сидел в телефоне.<br>Я думала, дело в работе, пока<br>не заметила, что со счёта<br>на квартиру исчезли деньги.</p></div>
        <button class="conversation-back" type="button" data-back="alice">назад</button>
        <button class="conversation-button conversation-alice__button" type="button" data-next="igor">послушать Игоря</button>
      </section>
      <section class="conversation-screen conversation-igor" aria-label="Игорь надеется, что успеет все исправить">
        <h2>надеется, что успеет все исправить</h2>
        <div class="conversation-story-circle conversation-story-circle--light"><p>Я проиграл наши деньги и боялся<br>сказать Алисе. Надеялся отыграться<br>и вернуть их на счёт раньше, чем она<br>заметит пропажу.</p></div>
        <img class="conversation-igor__figure" src="${asset}igor.png" alt="Игорь">
        <span class="conversation-person-name conversation-person-name--igor">Игорь</span>
        <button class="conversation-back" type="button" data-back="igor">назад</button>
        <button class="conversation-button conversation-igor__button" type="button" data-next="phrases">далее</button>
      </section>
      <section class="conversation-screen conversation-phrases" aria-label="Какие перемены вы заметили">
        <h2>какие перемены вы заметили?</h2>
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
  const savedSelection = getSavedAnswers()['recognition'].selected
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
  if (shouldRestoreAdvice('#recognition')) {
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
    const back = event.target.closest('[data-back]')
    if (back) {
      if (back.dataset.back === 'intro') {
        window.location.hash = '#menu'
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
      saveSelection('recognition', [...scene.querySelectorAll('.conversation-phrase[aria-pressed="true"]')].map((item) => item.dataset.answerId))
      return
    }
    if (event.target.closest('.conversation-phrases__next')) {
      if (!scene.querySelector('.conversation-phrase[aria-pressed="true"]')) return
      completeQuestion('recognition')
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
