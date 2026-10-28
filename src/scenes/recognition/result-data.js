import { answerTopics, questionOrder, specialAnswers } from './result-config.js'
import { buildResult } from './result-engine.js'

const storageKey = 'stavka-na-sebya:story-answers:v1'

export function resetStoryAnswers() {
  try {
    window.localStorage.removeItem(storageKey)
    return true
  } catch {
    return false
  }
}

function readStore() {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) || '{}')
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
  } catch {
    return {}
  }
}

function validSelection(questionId, selected) {
  const allowed = answerTopics[questionId]
  if (!allowed || !Array.isArray(selected)) return []
  const ids = [...new Set(selected.filter((id) => Object.hasOwn(allowed, id)))]
  const exclusive = specialAnswers[questionId]
  return ids.includes(exclusive) ? [exclusive] : ids
}

export function getSavedAnswers() {
  const stored = readStore()
  return Object.fromEntries(questionOrder.map((questionId) => {
    const entry = stored[questionId] || {}
    const selected = validSelection(questionId, entry.selected)
    return [questionId, { selected, completed: !!entry.completed && selected.length > 0 }]
  }))
}

function writeAnswers(answers) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(answers))
    return true
  } catch {
    return false
  }
}

export function saveSelection(questionId, selected) {
  if (!questionOrder.includes(questionId)) return false
  const answers = getSavedAnswers()
  const next = validSelection(questionId, selected)
  const unchanged = JSON.stringify(next) === JSON.stringify(answers[questionId].selected)
  answers[questionId] = {
    selected: next,
    completed: unchanged && answers[questionId].completed,
  }
  return writeAnswers(answers)
}

export function completeQuestion(questionId) {
  if (!questionOrder.includes(questionId)) return false
  const answers = getSavedAnswers()
  if (answers[questionId].selected.length === 0) return false
  answers[questionId].completed = true
  return writeAnswers(answers)
}

// Call when the final button is pressed, so edits to earlier answers are included.
export function getResultModel() {
  return buildResult(getSavedAnswers())
}
