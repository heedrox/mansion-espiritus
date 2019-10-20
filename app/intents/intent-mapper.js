const { keepReadingIntent } = require('./keep-reading');

const isText = (possibleTexts, conv) =>
  possibleTexts.indexOf(conv.body.queryResult.queryText) >= 0;

const intentMapper = (scure, conv, args, originalIntent) =>
  isText(scure.data.directSentences['sigue-leyendo'], conv) ? keepReadingIntent(args, conv.data)
    : originalIntent;


exports.intentMapper = intentMapper;
