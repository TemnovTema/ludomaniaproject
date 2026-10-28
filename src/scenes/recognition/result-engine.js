import { answerTopics, materialBindings, materialReasons, questionOrder, resultCopy, specialAnswers } from './result-config.js'

// Pure function: the same five saved selections always produce the same result.
export function buildResult(answers) {
  const selected = Object.fromEntries(questionOrder.map((question) => {
    const ids = answers?.[question]?.selected
    const valid = Array.isArray(ids) ? [...new Set(ids.filter((id) => Object.hasOwn(answerTopics[question], id)))] : []
    return [question, valid.includes(specialAnswers[question]) ? [specialAnswers[question]] : valid]
  }))
  const has = (question, id) => selected[question].includes(id)
  const ready = questionOrder.every((question) => answers?.[question]?.completed && selected[question].length)
  const evidence = Object.fromEntries(questionOrder.map((question) => [question, selected[question].map((answerId) => ({ answerId, topics: answerTopics[question][answerId], special: answerId === specialAnswers[question] }))]))

  const themeEvidence = new Map()
  for (const question of questionOrder) for (const answerId of selected[question]) {
    for (const topicId of answerTopics[question][answerId]) {
      if (!themeEvidence.has(topicId)) themeEvidence.set(topicId, [])
      themeEvidence.get(topicId).push({ questionId: question, answerId })
    }
  }
  const priority = ['responsibility', 'self-support', 'help', 'recognition', 'conversation']
  const ranked = [...themeEvidence].sort(([idA, matchesA], [idB, matchesB]) => {
    for (const question of priority) {
      const difference = matchesB.filter((item) => item.questionId === question).length - matchesA.filter((item) => item.questionId === question).length
      if (difference) return difference
    }
    return idA.localeCompare(idB)
  })
  const topics = ranked.slice(0, 2).map(([topicId, matches]) => ({ topicId, evidence: matches }))

  const impactOrder = ['repayingCredit', 'poorSleep', 'onAlert', 'guiltOrFearToRefuse', 'cancelledPlans', 'hardToTalk']
  const requestOrder = ['ownDebt', 'stopPayingDebts', 'protectOwnMoney', 'supportForSelf', 'relationshipTerms', 'suggestHelp']
  const first = (question, order) => order.find((id) => has(question, id))
  const request = first('responsibility', requestOrder)
  const impact = selected['self-support'].filter((id) => id !== 'none').sort((a, b) => {
    const requestTopics = request ? answerTopics.responsibility[request] : []
    const overlap = (id) => answerTopics['self-support'][id].filter((topic) => requestTopics.includes(topic)).length
    return overlap(b) - overlap(a) || impactOrder.indexOf(a) - impactOrder.indexOf(b)
  })[0]
  const action = first('help', Object.keys(resultCopy.action))
  const observation = first('recognition', Object.keys(resultCopy.observation))
  const sentences = []

  // Join three related financial answers into one statement rather than listing them.
  if (has('help', 'gaveMoneyOrCredit') && has('self-support', 'repayingCredit') && (has('responsibility', 'ownDebt') || has('responsibility', 'stopPayingDebts'))) {
    sentences.push('Вы помогали близкому с деньгами и теперь выплачиваете кредит или заём, взятый для этого.')
    sentences.push(has('responsibility', 'ownDebt') ? resultCopy.request.ownDebt : resultCopy.request.stopPayingDebts)
  } else {
    if (impact) sentences.push(resultCopy.impact[impact])
    else if (action) sentences.push(resultCopy.action[action])
    else if (observation) sentences.push(resultCopy.observation[observation])
    else if (has('conversation', 'notDiscussed')) sentences.push(resultCopy.special.notDiscussed)
    else if (selected.recognition.includes('none') || selected.help.includes('none') || selected['self-support'].includes('none')) sentences.push(resultCopy.special.none)
    else if (has('responsibility', 'unsureWhereToStart')) sentences.push(resultCopy.special.unsureWhereToStart)
    else if (selected.conversation.length) sentences.push('Вы отметили слова близкого об игре; сами по себе они не говорят о том, что будет дальше.')

    if (request) sentences.push(resultCopy.request[request])
    else if (impact && action && answerTopics.help[action].some((topic) => answerTopics['self-support'][impact].includes(topic))) sentences.push(resultCopy.action[action])
    else if (impact && observation && answerTopics.recognition[observation].some((topic) => answerTopics['self-support'][impact].includes(topic))) sentences.push(resultCopy.observation[observation])
    else if (has('responsibility', 'unsureWhereToStart') && !sentences.includes(resultCopy.special.unsureWhereToStart)) sentences.push(resultCopy.special.unsureWhereToStart)
    else if (has('conversation', 'notDiscussed') && !sentences.includes(resultCopy.special.notDiscussed)) sentences.push(resultCopy.special.notDiscussed)
    else if (sentences.length === 1 && action && !sentences.includes(resultCopy.action[action])) sentences.push(resultCopy.action[action])
  }
  if (sentences.length < 2) {
    const special = selected.recognition.includes('none') || selected.help.includes('none') || selected['self-support'].includes('none')
    if (special && !sentences.includes(resultCopy.special.none)) sentences.push(resultCopy.special.none)
    else if (has('responsibility', 'unsureWhereToStart') && !sentences.includes(resultCopy.special.unsureWhereToStart)) sentences.push(resultCopy.special.unsureWhereToStart)
    else sentences.push('Это отправная точка, чтобы выбрать тему, о которой вам хочется узнать больше.')
  }

  const recommendations = topics.length ? topics.map(({ topicId }) => ({ ...materialBindings[topicId], reason: materialReasons[topicId] })) : [{ ...materialBindings.introduction, reason: materialReasons.introduction }]
  return {
    ready: Boolean(ready), answers: selected, evidence, topics,
    title: resultCopy.title, observation: sentences.slice(0, 3).join(' '),
    startingPointTitle: resultCopy.startingPointTitle,
    recommendedMaterials: recommendations.slice(0, 2),
    explanation: resultCopy.explanation, supportButton: resultCopy.supportButton,
  }
}
