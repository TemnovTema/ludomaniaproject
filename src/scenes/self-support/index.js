import './style.css'

const asset = '/scenes/self-support/'
const phrases = [
  { text: 'я настораживаюсь, когда близкий<br>берёт телефон или меняется<br>его настроение', x: 57, y: 21 },
  { text: 'я виню себя в происходящем<br>или боюсь отказать близкому', x: 22, y: 29 },
  { text: 'я отменяю встречи с друзьями,<br>отдых или другие свои планы', x: 78, y: 34 },
  { text: 'я плохо сплю из-за тревоги<br>об игре или долгах', x: 18, y: 49 },
  { text: 'мне трудно говорить с ним<br>о чём-то, кроме игры и денег', x: 82, y: 60 },
  { text: 'я выплачиваю кредит или заём,<br>который взял(а), помогая ему', x: 18, y: 68 },
  { text: 'ничего из перечисленного', x: 85, y: 21, exclusive: true },
]

const advice = `
  <div class="conversation-advice" role="dialog" aria-modal="true" aria-label="Что делать">
    <div class="conversation-advice__circle">
      <h2>что делать?</h2>
      <div class="conversation-advice__copy">
        <p>Обращаться за поддержкой можно независимо<br class="conversation-desktop-break"> от того, признаёт ли близкий проблему и ищет ли<br class="conversation-desktop-break"> помощь для себя. Разговор с психологом, группа<br class="conversation-desktop-break"> поддержки или доверенный человек могут помочь вам<br class="conversation-desktop-break"> разобраться со своим состоянием и решениями.</p>
        <p>Не нужно ждать, пока ситуация станет ещё тяжелее.</p>
      </div>
      <a href="#help">Где получить поддержку для себя <span aria-hidden="true">➜</span></a>
    </div>
    <a class="conversation-advice__next" href="#responsibility">узнать, что было дальше</a>
    <button class="conversation-advice__close" type="button" aria-label="Закрыть">×</button>
  </div>`

export function renderSelfSupport(app) {
  app.innerHTML = `
    <main class="conversation conversation--self-support" data-step="intro">
      <section class="conversation-screen conversation-intro" aria-label="Помощь нужна не только ему">
        <h1>помощь нужна не только ему</h1>
        <div class="conversation-intro__portraits">
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}alice-portrait.jpg" alt="Портрет Алисы"></div><span>Алиса</span></div>
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}igor-portrait.jpg" alt="Портрет Игоря"></div><span>Игорь</span></div>
        </div>
        <p class="conversation-scroll-hint">скролльте вниз</p>
      </section>
      <section class="conversation-screen conversation-alice" aria-label="Алиса больше не может справляться одной">
        <h2>больше не получается справляться одной</h2>
        <span class="conversation-person-name conversation-person-name--alice">Алиса</span>
        <img class="conversation-alice__figure" src="${asset}alice.png" alt="Алиса">
        <div class="conversation-story-circle conversation-story-circle--dark"><p>К тому времени я уже чувствовала<br>себя измотанной. Долги оставались,<br>и я всё время думала, не играет ли он<br>снова. Я выплачивала кредит, ловила<br>каждую перемену в настроении Игоря,<br>и на себя сил уже не оставалось.<br><br>Мне всё ещё казалось, что помощь<br>прежде всего нужна ему, но одной<br>справляться уже не получалось —<br>и я записалась к психологу.</p></div>
        <button class="conversation-button conversation-alice__button" type="button" data-next="igor">послушать Игоря</button>
      </section>
      <section class="conversation-screen conversation-igor" aria-label="Игорь чувствует контроль и давление">
        <h2>чувствует контроль и давление</h2>
        <div class="conversation-story-circle conversation-story-circle--light"><p>Я замечал, как Алиса следила<br>за тем, что я делаю в телефоне,<br>и напрягалась, даже когда мы<br>говорили о том, что купить к ужину.<br>Меня злило, что она будто всё время<br>меня проверяла.<br><br>Я избегал разговоров об игре<br>и долгах. Мне было тяжело даже<br>думать о том, сколько ещё придётся<br>их выплачивать.</p></div>
        <img class="conversation-igor__figure" src="${asset}igor.png" alt="Игорь">
        <span class="conversation-person-name conversation-person-name--igor">Игорь</span>
        <button class="conversation-button conversation-igor__button" type="button" data-next="phrases">далее</button>
      </section>
      <section class="conversation-screen conversation-phrases" aria-label="Как эта ситуация повлияла на вас">
        <h2>как эта ситуация повлияла на вас?</h2>
        <p class="conversation-phrases__hint">можно выбрать несколько вариантов</p>
        <div class="conversation-phrases__field">
          ${phrases.map((phrase, index) => `<button class="conversation-phrase" type="button" aria-pressed="false" style="--x:${phrase.x}%;--y:${phrase.y}%;--i:${index}" data-phrase="${index}"${phrase.exclusive ? ' data-exclusive="true"' : ''}>${phrase.text}</button>`).join('')}
          <img class="conversation-phrases__figure" src="${asset}alice-igor.png" alt="">
        </div>
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
      if (selected) {
        if (phrase.dataset.exclusive === 'true') {
          scene.querySelectorAll('.conversation-phrase[aria-pressed="true"]').forEach((item) => item.setAttribute('aria-pressed', 'false'))
        } else {
          scene.querySelector('.conversation-phrase[data-exclusive="true"]')?.setAttribute('aria-pressed', 'false')
        }
      }
      phrase.setAttribute('aria-pressed', String(selected))
      scene.classList.toggle('conversation--has-selection', !!scene.querySelector('.conversation-phrase[aria-pressed="true"]'))
      return
    }
    if (event.target.closest('.conversation-phrases__next')) {
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
