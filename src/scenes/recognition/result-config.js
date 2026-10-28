// IDs are stable even if the visible phrases or their positions change.
// Edit the topics here when the editorial interpretation changes.
export const questionOrder = [
  'recognition',
  'conversation',
  'help',
  'self-support',
  'responsibility',
]

export const answerTopics = {
  recognition: {
    changedMood: ['wellbeing'],
    irritability: ['conversation'],
    hiddenSpending: ['money', 'conversation'],
    missingSharedMoney: ['money'],
    morePhoneTime: ['conversation'],
    none: [],
  },
  conversation: {
    promiseToStop: ['conversation'],
    promiseToWinBack: ['money', 'conversation'],
    earningClaim: ['money'],
    systemClaim: ['conversation'],
    controlClaim: ['conversation'],
    entertainmentClaim: ['conversation'],
    easyMoneyClaim: ['money'],
    specialKnowledgeClaim: ['conversation'],
    selfRelianceClaim: ['support'],
    notDiscussed: [],
  },
  help: {
    talkedAboutGame: ['conversation'],
    gaveMoneyOrCredit: ['money', 'helping', 'boundaries'],
    soughtSpecialist: ['helping', 'support'],
    involvedFamily: ['helping', 'support'],
    checkedExpensesOrPhone: ['money', 'conversation'],
    none: [],
  },
  'self-support': {
    onAlert: ['wellbeing', 'conversation'],
    guiltOrFearToRefuse: ['wellbeing', 'boundaries'],
    cancelledPlans: ['wellbeing', 'boundaries'],
    poorSleep: ['wellbeing'],
    hardToTalk: ['conversation', 'wellbeing'],
    repayingCredit: ['money', 'helping'],
    none: [],
  },
  responsibility: {
    stopPayingDebts: ['money', 'boundaries'],
    supportForSelf: ['support', 'wellbeing'],
    suggestHelp: ['helping', 'support'],
    ownDebt: ['money'],
    relationshipTerms: ['boundaries', 'conversation'],
    protectOwnMoney: ['money', 'boundaries'],
    unsureWhereToStart: [],
  },
}

export const specialAnswers = {
  recognition: 'none',
  conversation: 'notDiscussed',
  help: 'none',
  'self-support': 'none',
  responsibility: 'unsureWhereToStart',
}

// A match in question 5 has priority over all other questions; then 4, 3, 1 and 2.
// Within a priority level, repeated evidence for the same theme breaks ties.
export const topicPriority = [
  'responsibility',
  'self-support',
  'help',
  'recognition',
  'conversation',
]

export const maxResultTopics = 2

// Editorial slots. Fill these with approved copy and real project materials later.
// Each material binding can contain an existing project's title and URL.
export const resultContent = {
  observation: { default: null, byTopic: {} },
  startingPoint: { default: null, byTopic: {} },
  materialsByTopic: {},
  introductoryMaterial: null,
}
