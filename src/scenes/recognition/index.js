import './style.css'

export function renderRecognition(app) {
  app.innerHTML = `
    <main class="recognition" aria-labelledby="recognition-title">
      <a class="recognition__back" href="#menu">назад</a>

      <h1 class="recognition__title" id="recognition-title">
        узнала, что ее близкий<br>
        сделал ставки и проиграл
      </h1>

      <section class="recognition__characters" aria-label="Герои истории">
        <figure class="recognition__character recognition__character--alice">
          <div class="recognition__portrait-frame">
            <div class="recognition__portrait-disc">
              <img src="/scenes/recognition/alisa.jpg" alt="Портрет Алисы">
            </div>
          </div>
          <figcaption>Алиса</figcaption>
        </figure>

        <figure class="recognition__character recognition__character--igor">
          <div class="recognition__portrait-frame">
            <div class="recognition__portrait-disc">
              <img src="/scenes/recognition/igor.jpg" alt="Портрет Игоря">
            </div>
          </div>
          <figcaption>Игорь</figcaption>
        </figure>
      </section>

      <p class="recognition__scroll">скрольте вниз</p>
    </main>
  `
}
