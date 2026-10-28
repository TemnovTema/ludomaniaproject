import {
  answerTopics,
  maxResultTopics,
  questionOrder,
  resultContent,
  specialAnswers,
  topicPriority,
} from './result-config.js'

const storageKey = 'stavka-na-sebya:story-answers:v1'

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

// Returns evidence and editorial slots, never an invented interpretation or URL.
// The result page can render this only when ready is true.
export function getResultModel() {
  const answers = getSavedAnswers()
  const evidence = Object.fromEntries(questionOrder.map((questionId) => [
    questionId,
    answers[questionId].selected.map((answerId) => ({
      answerId,
      topics: answerTopics[questionId][answerId],
      special: answerId === specialAnswers[questionId],
    })),
  ]))

  const byTopic = new Map()
  for (const questionId of questionOrder) {
    for (const item of evidence[questionId]) {
      for (const topicId of item.topics) {
        if (!byTopic.has(topicId)) byTopic.set(topicId, { topicId, evidence: [], priority: [] })
        const topic = byTopic.get(topicId)
        topic.evidence.push({ questionId, answerId: item.answerId })
      }
    }
  }

  for (const topic of byTopic.values()) {
    topic.priority = topicPriority.map((questionId) =>
      topic.evidence.filter((item) => item.questionId === questionId).length)
  }

  const ranked = [...byTopic.values()].sort((a, b) => {
    for (let index = 0; index < topicPriority.length; index += 1) {
      if (a.priority[index] !== b.priority[index]) return b.priority[index] - a.priority[index]
    }
    return a.topicId.localeCompare(b.topicId)
  })
  const topics = ranked.slice(0, maxResultTopics).map(({ topicId, evidence: matches }) => ({
    topicId,
    evidence: matches,
    observationTemplate: resultContent.observation.byTopic[topicId] ?? null,
    startingPointTemplate: resultContent.startingPoint.byTopic[topicId] ?? null,
    materials: resultContent.materialsByTopic[topicId] ?? [],
  }))
  const recommendedMaterials = [...new Map(topics.flatMap((topic) =>
    topic.materials.map((material) => [material.id, material])
  )).values()].slice(0, maxResultTopics)

  return {
    ready: questionOrder.every((questionId) => answers[questionId].completed),
    answers,
    evidence,
    topics,
    recommendedMaterials,
    noStatedRequest: evidence.responsibility.some((item) => item.answerId === 'unsureWhereToStart'),
    introductoryMaterial: topics.length === 0 ? resultContent.introductoryMaterial : null,
    defaultObservationTemplate: resultContent.observation.default,
    defaultStartingPointTemplate: resultContent.startingPoint.default,
  }
}
