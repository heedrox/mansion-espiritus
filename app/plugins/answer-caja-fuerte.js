const numeralize = x =>
  x.replace(/\buno\b/g, '1')
    .replace(/\bdos\b/g, '2')
    .replace(/\btres\b/g, '3')
    .replace(/\bcuatro\b/g, '4')
    .replace(/\bcinco\b/g, '5')
    .replace(/\bseis\b/g, '6')
    .replace(/\bsiete\b/g, '7')
    .replace(/\bocho\b/g, '8')
    .replace(/\bnueve\b/g, '9')
    .replace(/\bcero\b/g, '0')
    .replace(/\D/g, '');

const POSSIBLE_ANSWERS = {
  '6143': 'caja-fuerte-answer-6143',
  '3416': 'caja-fuerte-answer-3416',
  '3584': 'caja-fuerte-answer-3584',
  'default': 'caja-fuerte-answer-default'
};

exports.answerCajaFuerte = (data, scure, userAnswer) => {
  if (typeof userAnswer === 'undefined') return '';
  const cleanAnswer = numeralize(userAnswer);
  const sentence = typeof POSSIBLE_ANSWERS[cleanAnswer] !== 'undefined' ? POSSIBLE_ANSWERS[cleanAnswer] : POSSIBLE_ANSWERS['default'];
  return scure.sentences.get(sentence);
};
