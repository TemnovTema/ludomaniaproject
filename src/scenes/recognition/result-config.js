export const questionOrder = ['recognition', 'conversation', 'help', 'self-support', 'responsibility']

export const answerTopics = {
  recognition: { changedMood: ['conversation'], irritability: ['conversation'], hiddenSpending: ['money', 'conversation'], missingSharedMoney: ['money'], morePhoneTime: ['conversation'], none: [] },
  conversation: { promiseToStop: ['conversation'], promiseToWinBack: ['money', 'conversation'], earningClaim: ['money'], systemClaim: ['conversation'], controlClaim: ['conversation'], entertainmentClaim: ['conversation'], easyMoneyClaim: ['money'], specialKnowledgeClaim: ['conversation'], selfRelianceClaim: ['support'], notDiscussed: [] },
  help: { talkedAboutGame: ['conversation'], gaveMoneyOrCredit: ['money', 'boundaries'], soughtSpecialist: ['support'], involvedFamily: ['support'], checkedExpensesOrPhone: ['money', 'conversation'], none: [] },
  'self-support': { onAlert: ['wellbeing', 'conversation'], guiltOrFearToRefuse: ['wellbeing', 'boundaries'], cancelledPlans: ['wellbeing', 'boundaries'], poorSleep: ['wellbeing'], hardToTalk: ['conversation', 'wellbeing'], repayingCredit: ['money', 'boundaries'], none: [] },
  responsibility: { stopPayingDebts: ['money', 'boundaries'], supportForSelf: ['support', 'wellbeing'], suggestHelp: ['support', 'boundaries'], ownDebt: ['money'], relationshipTerms: ['boundaries', 'conversation'], protectOwnMoney: ['money', 'boundaries'], unsureWhereToStart: [] },
}

export const specialAnswers = { recognition: 'none', conversation: 'notDiscussed', help: 'none', 'self-support': 'none', responsibility: 'unsureWhereToStart' }

export const resultCopy = {
  title: 'как игра близкого вас затронула',
  explanation: 'результат не определяет, есть ли у вашего близкого игровая зависимость. но помогает заметить, как происходящее влияет на вас и в чем может понадобиться поддержка',
  startingPointTitle: 'С чего можно начать',
  supportButton: 'Узнать о вариантах помощи',
  impact: {
    onAlert: 'Вы стали настораживаться, когда меняется настроение близкого или он берёт телефон.',
    guiltOrFearToRefuse: 'Вы вините себя в происходящем или боитесь отказать близкому.',
    cancelledPlans: 'Из-за этой ситуации вы отменяете встречи и другие свои планы.',
    poorSleep: 'Тревога об игре или долгах мешает вам спать.',
    hardToTalk: 'Вам стало трудно говорить с близким о чём-то, кроме игры и денег.',
    repayingCredit: 'Вы выплачиваете кредит или заём, который взяли ради помощи близкому.',
  },
  action: {
    talkedAboutGame: 'Вы уже говорили с близким об игре и просили его остановиться.',
    gaveMoneyOrCredit: 'Вы давали деньги, закрывали долги или брали для этого кредит.',
    soughtSpecialist: 'Вы уже искали для близкого специалиста или группу поддержки.',
    involvedFamily: 'Вы обращались к другим близким, чтобы вместе решить, что делать.',
    checkedExpensesOrPhone: 'Вы проверяли его расходы, телефон или игровые приложения.',
  },
  observation: {
    changedMood: 'Вы заметили, что близкий стал заметно более расстроенным.',
    irritability: 'Вы заметили, что близкий стал раздражительнее или резче отвечать.',
    hiddenSpending: 'Вы заметили, что близкий скрывает траты или уходит от вопросов о деньгах.',
    missingSharedMoney: 'Вы отметили пропажу общих денег или неожиданные расходы.',
    morePhoneTime: 'Вы заметили, что близкий чаще сидит в телефоне, в том числе ночью.',
  },
  request: {
    stopPayingDebts: 'Сейчас вам важно разобраться, как прекратить оплачивать долги близкого.',
    supportForSelf: 'Сейчас вы хотите узнать, где получить поддержку для себя.',
    suggestHelp: 'Сейчас вы хотите понять, как предложить близкому помощь, оставив решение за ним.',
    ownDebt: 'Сейчас вас интересует, что делать с долгом или кредитом, оформленным на вас.',
    relationshipTerms: 'Сейчас вы хотите понять, на каких условиях готовы продолжать отношения.',
    protectOwnMoney: 'Сейчас вы хотите разобраться, как защитить свои деньги и необходимые расходы.',
  },
  special: {
    none: 'Предложенные варианты не описали вашу ситуацию.',
    notDiscussed: 'Вы отметили, что ещё не говорили с близким об игре.',
    unsureWhereToStart: 'Вы пока не знаете, с какого вопроса начать.',
  },
}

// The existing help pages have no published materials. Bind real titles and URLs here later.
export const materialBindings = Object.fromEntries(['money', 'wellbeing', 'conversation', 'boundaries', 'support', 'introduction'].map((id) => [id, { id, title: null, url: null }]))
export const materialReasons = {
  money: 'Поможет разобраться с вопросами о деньгах и собственных обязательствах.',
  wellbeing: 'Поможет обратить внимание на то, как ситуация влияет на вас.',
  conversation: 'Поможет подготовиться к разговору о том, что происходит.',
  boundaries: 'Поможет определить, какие решения остаются за вами.',
  support: 'Поможет сориентироваться в вариантах поддержки для себя и близкого.',
  introduction: 'Поможет начать с общего обзора вариантов поддержки.',
}
