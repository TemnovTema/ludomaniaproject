import './style.css'

const asset = '/scenes/conversation/'
const phrases = [
  { text: '«я больше не буду играть»', x: 15, y: 35 },
  { text: 'мы ещё не говорили<br>об игре', x: 34, y: 27 },
  { text: '«я отыграюсь<br>и верну деньги»', x: 52, y: 34 },
  { text: '«у меня есть система»', x: 88, y: 34 },
  { text: '«это просто развлечение»', x: 18, y: 50 },
  { text: '«я могу контролировать игру,<br>играть аккуратно»', x: 72, y: 49 },
  { text: '«я сам справлюсь»', x: 15, y: 64 },
  { text: '«на этом можно<br>заработать»', x: 88, y: 67 },
  { text: '«я знаю то,<br>чего не знают другие»', x: 20, y: 79 },
  { text: '«это лёгкие деньги»', x: 73, y: 74 },
]

const advice = `
  <div class="conversation-advice" role="dialog" aria-modal="true" aria-label="Что делать">
    <div class="conversation-advice__circle">
      <h2>что делать?</h2>
      <div class="conversation-advice__copy">
        <p>После признания можно спросить о конкретных последствиях: сколько денег не хватает, какие платежи предстоят, есть ли ещё долги.</p>
        <p>Скажите, как это затрагивает вас. Необязательно за один разговор добиться обещания больше никогда не играть: важнее понять, что происходит сейчас и какой следующий шаг человек готов обсудить.</p>
      </div>
      <a href="#help">Как поговорить с близким <span aria-hidden="true">➜</span></a>
    </div>
    <button class="conversation-advice__close" type="button" aria-label="Закрыть">×</button>
  </div>`

export function renderConversation(app) {
  app.innerHTML = `
    <main class="conversation" data-step="intro">
      <section class="conversation-screen conversation-intro" aria-label="Он признался и пообещал остановиться">
        <h1>он признался<br>и пообещал остановиться</h1>
        <div class="conversation-intro__portraits">
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}alice-portrait.jpg" alt="Портрет Алисы"></div><span>Алиса</span></div>
          <div class="conversation-intro__person"><div class="conversation-intro__ring"><img src="${asset}igor-portrait.jpg" alt="Портрет Игоря"></div><span>Игорь</span></div>
        </div>
        <p class="conversation-scroll-hint">скролльте вниз</p>
      </section>
      <section class="conversation-screen conversation-alice" aria-label="Алиса хочет верить">
        <h2>хочет верить, но боится повторения</h2>
        <span class="conversation-person-name conversation-person-name--alice">Алиса</span>
        <img class="conversation-alice__figure" src="${asset}alice.png" alt="Алиса">
        <div class="conversation-story-circle conversation-story-circle--dark"><p>Не успела я собраться с мыслями,<br>как Игорь сам начал разговор.<br>Он признался, что проиграл деньги<br>на ставках, и пообещал прекратить.<br>Мне хотелось ему поверить,<br>но я боялась, что это повторится.</p></div>
        <button class="conversation-button conversation-alice__button" type="button" data-next="igor">послушать игоря</button>
      </section>
      <section class="conversation-screen conversation-igor" aria-label="Игорь верит, что сможет остановиться">
        <h2>верит, что сможет остановиться</h2>
        <div class="conversation-story-circle conversation-story-circle--light"><p>Я сказал Алисе, что сделал пару<br>ставок и больше играть не буду.<br><br>О том, что уже крупно проиграл<br>и залез в долги, я промолчал. Тогда<br>я верил, что смогу остановиться сам.<br><br>Некоторое время я не играл, потом<br>снова начал ставить понемногу.<br>Постепенно суммы выросли, и я опять<br>проиграл много денег.</p></div>
        <img class="conversation-igor__figure" src="${asset}igor.png" alt="Игорь">
        <span class="conversation-person-name conversation-person-name--igor">Игорь</span>
        <button class="conversation-button conversation-igor__button" type="button" data-next="phrases">далее</button>
      </section>
      <section class="conversation-screen conversation-phrases" aria-label="Какие фразы от близкого вы слышали">
        <h2>какие фразы от близкого вы слышали?</h2>
        <div class="conversation-phrases__field">
          ${phrases.map((phrase, index) => `<button class="conversation-phrase" type="button" aria-pressed="false" style="--x:${phrase.x}%;--y:${phrase.y}%;--i:${index}" data-phrase="${index}">${phrase.text}</button>`).join('')}
          <img class="conversation-phrases__figure" src="${asset}igor.png" alt="">
          <p class="conversation-phrases__hint">можно выбрать<br>несколько вариантов</p>
        </div>
        <button class="conversation-button conversation-phrases__next" type="button">далее</button>
        <button class="conversation-button conversation-phrases__advice" type="button">что делать?</button>
      </section>
    </main>`

  const scene = app.querySelector('.conversation')
  let step = 'intro'
  let revealTimer
  const setStep = (next) => {
    clearTimeout(revealTimer)
    step = next
    scene.dataset.step = next
    scene.classList.remove('conversation--ready')
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (next === 'alice' || next === 'igor') {
      revealTimer = window.setTimeout(() => scene.classList.add('conversation--ready'), 1800)
    }
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
    if (event.target.closest('.conversation-phrases__next')) {
      scene.classList.add('conversation--submitted')
      return
    }
    if (event.target.closest('.conversation-phrases__advice')) {
      scene.insertAdjacentHTML('beforeend', advice)
      requestAnimationFrame(() => scene.querySelector('.conversation-advice')?.classList.add('is-open'))
      return
    }
    if (event.target.closest('.conversation-advice__close')) scene.querySelector('.conversation-advice')?.remove()
  })
}
