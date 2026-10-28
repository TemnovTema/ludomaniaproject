import './style.css'

const asset = '/scenes/help/'
const phrases = [
  { text: 'говорил(а) с близким об игре<br>и просил(а) остановиться', x: 50, y: 21 },
  { text: 'давал(а) деньги, закрывал(а) долги<br>или брал(а) для этого кредит', x: 18, y: 34 },
  { text: 'искал(а) для него специалиста<br>или группу поддержки', x: 78, y: 34 },
  { text: 'обращался(ась) к другим близким,<br>чтобы вместе решить, что делать.', x: 17, y: 60 },
  { text: 'проверял(а) его расходы,<br>телефон или игровые приложения', x: 82, y: 60 },
]

const advice = `
  <div class="conversation-advice" role="dialog" aria-modal="true" aria-label="Что делать">
    <div class="conversation-advice__circle">
      <h2>что делать?</h2>
      <div class="conversation-advice__copy">
        <p>Желание немедленно помочь с долгами понятно:<br class="conversation-desktop-break"> вам хочется обезопасить свою семью. Прежде чем<br class="conversation-desktop-break"> передавать деньги или брать кредит, выясните, какие<br class="conversation-desktop-break"> обязательства оформлены на вас и чем вы будете<br class="conversation-desktop-break"> оплачивать собственные необходимые расходы.</p>
        <p>Если близкий готов участвовать, можно вместе собрать<br class="conversation-desktop-break"> сведения о его задолженностях и обратиться<br class="conversation-desktop-break"> за финансовой консультацией — без обещания<br class="conversation-desktop-break"> погасить их за него.</p>
      </div>
      <a href="#help">Как безопасно помочь близкому <span aria-hidden="true">➜</span></a>
    </div>
    <a class="conversation-advice__next" href="#boundaries">узнать, что было дальше</a>
    <button class="conversation-advice__close" type="button" aria-label="Закрыть">×</button>
  </div>`

export function renderHelp(app) {
  app.innerHTML = `
    <main class="conversation conversation--help" data-step="intro">
      <section class="conversation-screen conversation-intro" aria-label="Долгов оказалось больше, и он попросил помочь">
        <h1>долгов оказалось больше,<br>и он попросил помочь</h1>
        <div class="conversation-intro__portraits">
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}alice-portrait.jpg" alt="Портрет Алисы"></div><span>Алиса</span></div>
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}igor-portrait.jpg" alt="Портрет Игоря"></div><span>Игорь</span></div>
        </div>
        <p class="conversation-scroll-hint">скролльте вниз</p>
      </section>
      <section class="conversation-screen conversation-alice" aria-label="Алиса хочет помочь, пока не выросли долги">
        <h2>хочет помочь, пока не выросли долги</h2>
        <span class="conversation-person-name conversation-person-name--alice">Алиса</span>
        <img class="conversation-alice__figure" src="${asset}alice.png" alt="Алиса">
        <div class="conversation-story-circle conversation-story-circle--dark"><p>Я думала, что Игорь проиграл только<br>наши накопления, но вскоре узнала<br>о других долгах и просрочках.<br><br>Я пыталась говорить с ним<br>об игре и искала специалиста,<br>а он настаивал, что сначала нужно<br>закрыть долги, и снова обещал<br>остановиться.<br><br>В итоге я взяла кредит, решив,<br>что с игрой мы разберёмся потом.</p></div>
        <button class="conversation-button conversation-alice__button" type="button" data-next="igor">послушать Игоря</button>
      </section>
      <section class="conversation-screen conversation-igor" aria-label="Игорь надеется отыграться и все вернуть">
        <h2>надеется отыграться и все вернуть</h2>
        <div class="conversation-story-circle conversation-story-circle--light"><p>Мне казалось, что пока мы ищем<br>специалиста, проценты будут расти,<br>поэтому я и попросил Алису помочь.<br><br>Часть денег я отдал кредиторам,<br>остальное оставил на другие платежи.<br><br>Несколько недель я не играл,<br>но потом снова начал ставить:<br>надеялся выиграть и быстрее вернуть<br>Алисе деньги. Но я снова проиграл.</p></div>
        <img class="conversation-igor__figure" src="${asset}igor.png" alt="Игорь">
        <span class="conversation-person-name conversation-person-name--igor">Игорь</span>
        <button class="conversation-button conversation-igor__button" type="button" data-next="phrases">далее</button>
      </section>
      <section class="conversation-screen conversation-phrases" aria-label="Что вы делали, когда узнали об игре и ее последствиях">
        <h2>что вы делали, когда узнали<br>об игре и ее последствиях?</h2>
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
