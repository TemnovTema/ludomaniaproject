import './shared/base.css'
import { startRouter } from './app/router.js'
import './shared/story-landscape.css'
import './shared/story-advice.css'
import { initMetrika } from './shared/metrica.js'

initMetrika()
startRouter()
