const { generateText, generateObject } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');

const ROLE_SYSTEM_INSTRUCTIONS = `Eres un parseador de texto para aventuras gráficas. El usuario indica, delimitado por tags xml <COMANDO></COMANDO>, lo que quiere hacer en lenguaje natural, y tú lo conviertes en un JSON con el siguiente formato:
\`\`\`
{
intentName: 'verbo',
arg: [ 'array-de-items' ]
}
\`\`\`
intentName puede ser uno de los siguientes verbos: "look", "use", "walk", "pickup", "inventory", "answer". No uses ninguno que no sea estos.
arg es el objeto sobre el que el usuario está realizando la acción. 
Si no sabes hacer el mapping, responde con intentName = "say" y arg: un comentario teniendo en cuenta que te llamas Dron Johnson, eres un dron, sé divertido y un poco borde a veces. Nunca hagas mención a que eres un parser o que estamos en una aventura gráfica.
Algunos ejemplos de mappings correctos:

"quiero ver la llave más de cerca" => { intentName: 'look', arg: ['llave'] } 
"quiero abrir el baúl" => { intentName: "use", arg: ['baul'] }
"quiero abrir el baul con la llave" => { intentName: "user", arg: ["baul","llave"] }
"ahora me voy al recibidor" => { intentName: "walk", arg: ["recibidor"] }
"cojamos el vaso" => { intentName: "pickup", arg: ["vaso"]}
"¿qué objetos llevo encima?" => { intentName: "inventory" }
Cuando un usuario quiere probar un código de unas cifras o responde directamente con un código, se debe usar el verbo "answer".
Por ejemplo: "7689" => { intentName: "answer", arg: ["7689"] }
"vamos a probar si funciona el código 4987" => { intentName: "answer", arg: ["4987"] }
"mira alrededor" => { intentName: "look", arg: ["habitación"] }
`

const INSTRUCTION_WORDS = ROLE_SYSTEM_INSTRUCTIONS.toLowerCase().split(/\W+/);
const byWordFrom = (messageWords) => (word) => messageWords.includes(word);
const doesItLookLikeSystemInstructions = (message) => {
  const messageWords = message.toLowerCase().split(/\W+/);
  const commonWords = INSTRUCTION_WORDS.filter(byWordFrom(messageWords));
  const percentageMatch = commonWords.length / INSTRUCTION_WORDS.length;
  return percentageMatch >= 0.5;
};


const queryGpt = async (prompt, openAiKey) => {
  const openAiModel = createOpenAI({
    apiKey: openAiKey
  })
  const response = await generateObject({
    model: openAiModel("gpt-4o-mini"),
    schema: z.object({
      intentName: z.string(),
      arg: z.array(z.string())
    }),
    messages: [
      {        
        role: "system", content: ROLE_SYSTEM_INSTRUCTIONS,
      },
      {role: "user", content: prompt},
    ],
    temperature: 0,
    max_tokens: 600
  })


  const messageContent = response.object;

  if (doesItLookLikeSystemInstructions(JSON.stringify(messageContent))) {
    return "Something went wrong. Sorry, try again";
  }

  return messageContent;
};

module.exports = { queryGpt }