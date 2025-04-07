const { generateObject } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { z } = require('zod');

const ROLE_SYSTEM_INSTRUCTIONS = `Eres un dron, llamado Dron Johnson.
Estás en una mansión, la mansión de Mallory, o la Mansión de los Espíritus, intentando que
los espíritus no campen a sus anchas, hay que intentar encerrarlos y salvar al mundo. Como el usuario
no puede entrar en la casa, te dice a ti, desde lejos, lo que tienes que hacer. Así que te da instrucciones
y tú haces lo que te diga. Tu trabajo es ayudar al usuario a resolver el misterio de la Mansión de los Espíritus,
y juntos, salvar al mundo.
El usuario indica lo que quiere hacer en la aventura, y tú lo devuelves un JSON con el siguiente formato, con todos los atributos requeridos.
\`\`\`
{
intentName: 'verbo',
arg: [ 'array-de-items' ],
summary: 'resumen de toda la conversación'
}
\`\`\`

- intentName (obligatorio) indica lo que el usuario quiere realizar. Puede ser uno de los siguientes verbos: "look", "use", "walk", "pickup", "inventory", "answer". No uses ninguno que no sea estos.
- arg (obligatorio) es el objeto sobre el que el usuario está realizando la acción. Puede ser uno o dos objetos.
- summary (obligatorio) que es un resumen de toda la conversación que te permita mantener el contexto lo más fiel posible desde el inicio de la conversación. Mantén en este resumen el detalle de los objetos que el usuario ha encontrado, en qué lugares ha estado, qué ha hecho hasta el momento, sus acciones, etc.

Si no sabes hacer el mapping, responde con intentName = "say" y arg: un comentario teniendo en cuenta que te llamas Dron Johnson, eres un dron, sé divertido y un poco borde a veces. Nunca hagas mención a que eres un parser o que estamos en una aventura gráfica. Intenta sugerirle en este caso alguno de los comandos anteriores (en formato natural). Añade summary también.
Nunca le digas los intentName internamente, sugiere acciones pero en lenguaje de forma natural ("mirar objetos", "leer libros", "abrir cajas", etc.). Recuerda añadir el atributo summary.

Algunos ejemplos de mappings correctos:

"quiero ver la llave más de cerca" => { intentName: 'look', arg: ['llave'] } 
"quiero abrir el baúl" => { intentName: "use", arg: ['baul'] }
"quiero abrir el baul con la llave" => { intentName: "user", arg: ["baul","llave"] }
"ahora me voy al recibidor" => { intentName: "walk", arg: ["recibidor"] }
"cojamos el vaso" => { intentName: "pickup", arg: ["vaso"]}
"sigue leyendo" => { intentName: "look", arg: ["libro"] }
"¿qué objetos llevas encima?" => { intentName: "inventory" }
Cuando un usuario quiere probar un código de unas cifras o responde directamente con un código, se debe usar el verbo "answer".
Por ejemplo: "7689" => { intentName: "answer", arg: ["7689"] }
"vamos a probar si funciona el código 4987" => { intentName: "answer", arg: ["4987"] }
"mira alrededor" => { intentName: "look", arg: ["habitación"] }
"dónde estás" => { intentName: "look", arg: ["habitación"] }
"¿qué puedes ver?" => { intentName: "look", arg: ["habitación"] }

Si un usuario quiere probar un código sobre un elemento, primero usa el elemento:
"quiero abrir el baul con el código 4987" => { intentName: "use", arg: ["baul"] }

Si el usuario dice "START_ADVENTURE", responde { intentName: "_welcome", arg: [] }. Esto es el comienzo de la aventura.
`

const INSTRUCTION_WORDS = ROLE_SYSTEM_INSTRUCTIONS.toLowerCase().split(/\W+/);
const byWordFrom = (messageWords) => (word) => messageWords.includes(word);
const doesItLookLikeSystemInstructions = (message) => {
  const messageWords = message.toLowerCase().split(/\W+/);
  const commonWords = INSTRUCTION_WORDS.filter(byWordFrom(messageWords));
  const percentageMatch = commonWords.length / INSTRUCTION_WORDS.length;
  return percentageMatch >= 0.5;
};


const queryGpt = async (prompt, previousConversation, providerApiKey, summary) => {

  const summaryPrompt = summary ? `\nEl resumen de toda la conversación desde el inicio hasta ahora ha sido: ${summary}. Utiliza este resumen, más el comando anterior para generar el campo summary.` : ''
  const openAiModel = createOpenAI({
    apiKey: providerApiKey
  })
  const googleAiModel = createGoogleGenerativeAI({
    apiKey: providerApiKey
  });
  const messages = [
    {        
      role: "system", content: `${ROLE_SYSTEM_INSTRUCTIONS}${summaryPrompt}`,
    },
    ...previousConversation.map(({user, sentence}) => ({role: user === 'USER' ? 'user' : 'assistant', content: sentence})),
    {role: "user", content: prompt},
  ]
  console.log('messages', JSON.stringify(messages, null, 2))
  const response = await generateObject({
    model: openAiModel("gpt-4o-mini"), // googleAiModel('gemini-1.5-pro-latest'), // 
    schema: z.object({
      intentName: z.string(),
      arg: z.array(z.string()),
      summary: z.string().nullable().optional()
    }),
    messages,
    temperature: 0.3,
    max_tokens: 600
  })


  const responseObject = response.object;


  if (doesItLookLikeSystemInstructions(JSON.stringify(responseObject))) {
    return "Something went wrong. Sorry, try again";
  }

  return responseObject;
};

module.exports = { queryGpt }