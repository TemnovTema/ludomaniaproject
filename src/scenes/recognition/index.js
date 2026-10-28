import './style.css'

const asset = '/scenes/recognition/'
const phrases = [
  { text: 'стал заметно более расстроенным,<br>чем обычно, но не говорит, что случилось', x: 47, y: 19 },
  { text: 'он стал раздражительнее или резче<br>отвечать на обычные вопросы', x: 19, y: 36 },
  { text: 'он начал скрывать траты<br>или уходить от вопросов о деньгах', x: 74, y: 34 },
  { text: 'пропали общие деньги<br>или появились расходы, о которых<br>я не знал(а)', x: 83, y: 55 },
  { text: 'близкий стал чаще сидеть<br>в телефоне, в том числе ночью', x: 18, y: 67 },
]

const advice = `
  <div class="conversation-advice" role="dialog" aria-modal="true" aria-label="Что делать">
    <div class="conversation-advice__circle">
      <h2>что делать?</h2>
      <div class="conversation-advice__copy">
        <p>У перемен могут быть разные причины.<br class="conversation-desktop-break"> Пока вы не знаете, что произошло, отделите факты<br class="conversation-desktop-break"> от догадок: какие расходы вызывают вопросы, хватает<br class="conversation-desktop-break"> ли денег на общие платежи и насколько открыто<br class="conversation-desktop-break"> близкий говорит с вами о финансах. Если затронуты<br class="conversation-desktop-break"> ваши деньги, проверьте счета, к которым у вас есть<br class="conversation-desktop-break"> доступ, и позаботьтесь о сохранности своих средств.</p>
      </div>
      <a href="#help">Как поговорить с близким <span aria-hidden="true">➜</span></a>
    </div>
    <a class="conversation-advice__next" href="#conversation">узнать, что было дальше</a>
    <button class="conversation-advice__close" type="button" aria-label="Закрыть">×</button>
  </div>`

export function renderRecognition(app) {
  app.innerHTML = `
    <main class="conversation conversation--recognition" data-step="intro">
      <section class="conversation-screen conversation-intro" aria-label="Узнала, что ее близкий сделал ставки и проиграл">
        <h1>узнала, что ее близкий<br>сделал ставки и проиграл</h1>
        <div class="conversation-intro__portraits">
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}alice-portrait.jpg" alt="Портрет Алисы"></div><span>Алиса</span></div>
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}igor-portrait.jpg" alt="Портрет Игоря"></div><span>Игорь</span></div>
        </div>
        <p class="conversation-scroll-hint">скролльте вниз</p>
      </section>
      <section class="conversation-screen conversation-alice" aria-label="Алиса заметила изменения">
        <h2>заметила изменения</h2>
        <span class="conversation-person-name conversation-person-name--alice">Алиса</span>
        <img class="conversation-alice__figure" src="${asset}alice.png" alt="Алиса">
        <div class="conversation-story-circle conversation-story-circle--dark"><p>Игорь стал раздражительным, поздно<br>ложился и подолгу сидел в телефоне.<br>Я думала, дело в работе, пока<br>не заметила, что со счёта<br>на квартиру исчезли деньги.</p></div>
        <button class="conversation-button conversation-alice__button" type="button" data-next="igor">послушать Игоря</button>
      </section>
      <section class="conversation-screen conversation-igor" aria-label="Игорь надеется, что успеет все исправить">
        <h2>надеется, что успеет все исправить</h2>
        <div class="conversation-story-circle conversation-story-circle--light"><p>Я проиграл наши деньги и боялся<br>сказать Алисе. Надеялся отыграться<br>и вернуть их на счёт раньше, чем она<br>заметит пропажу.</p></div>
        <img class="conversation-igor__figure" src="${asset}igor.png" alt="Игорь">
        <span class="conversation-person-name conversation-person-name--igor">Игорь</span>
        <button class="conversation-button conversation-igor__button" type="button" data-next="phrases">далее</button>
      </section>
      <section class="conversation-screen conversation-phrases" aria-label="Какие перемены вы заметили">
        <h2>какие перемены вы заметили?</h2>
        <p class="conversation-phrases__hint">можно выбрать несколько вариантов</p>
        <div class="conversation-phrases__field">
          ${phrases.map((phrase, index) => `<button class="conversation-phrase" type="button" aria-pressed="false" style="--x:${phrase.x}%;--y:${phrase.y}%;--i:${index}" data-phrase="${index}">${phrase.text}</button>`).join('')}
          <img class="conversation-phrases__figure" src="${asset}alice-igor.png" alt="">
        </div>
        <button class="conversation-phrases__no-talk" type="button">ничего из перечисленного</button>
        <button class="conversation-button conversation-phrases__next" type="button">далее</button>
        <button class="conversation-button conversation-phrases__advice" type="button">что делать?</button>
      </section>
    </main>`

  const scene = app.querySelector('.conversation')
  let step = 'intro'
  let revealTimer
  let transitionTimer
  let adviceRevealTimer
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
    const next = event.target.closest('[data-next]')
    if (next) { setStep(next.dataset.next); return }
    const phrase = event.target.closest('.conversation-phrase')
    if (phrase && !scene.classList.contains('conversation--submitted')) {
      const selected = phrase.getAttribute('aria-pressed') !== 'true'
      phrase.setAttribute('aria-pressed', String(selected))
      scene.classList.toggle('conversation--has-selection', !!scene.querySelector('.conversation-phrase[aria-pressed="true"]'))
      return
    }
    if (event.target.closest('.conversation-phrases__next, .conversation-phrases__no-talk')) {
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
      scene.insertAdjacentHTML('beforeend', advice)
      const advicePanel = scene.querySelector('.conversation-advice')
      requestAnimationFrame(() => advicePanel?.classList.add('is-open'))
      clearTimeout(adviceRevealTimer)
      adviceRevealTimer = window.setTimeout(() => advicePanel?.classList.add('is-ready'), 1550)
      return
    }
    if (event.target.closest('.conversation-advice__close')) {
      clearTimeout(adviceRevealTimer)
      scene.querySelector('.conversation-advice')?.remove()
    }
  })
}
