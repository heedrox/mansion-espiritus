const DroneResponseGenerator = require('../multiscapes/domain/DroneResponseGenerator');
const dotenv = require('dotenv');

dotenv.config();
const messages = [
    {
        message: "¡Vamos a escanear esos acantilados! 🏞️🔍 Son altos y erosionados, y parece que tienen algunas marcas grabadas, aunque están bastante deterioradas. ¡Misterioso, ¿no?!<br><br>Observando más de cerca, parece que hay muescas que podrían ser letras. ¿Quizás pistas de la civilización antigua? 🚀✨ Te recomiendo que echemos un vistazo a esas marcas, podría haber algo valioso allí.<br><br>¿Te gustaría que te envíe una foto de los detalles? 📸",
        user: "drone",
        timestamp: new Date().toISOString()
    },
    {
        message: "saca fotos de las marcas tambien",
        user: "player",
        timestamp: new Date().toISOString()
    }
];

let num = 0;
// Act with timeout protection
(async () => {
    while (true) {
        let result;
        try {
            result = await DroneResponseGenerator.generateResponse(messages, 'test-codex')
            num++;
            console.log('num of correct responses:',result, num);
        } catch (error) {
            console.log('❌ AI call failed or timed out:', error.message);
            process.exit(1);
            return;
        }
    }
})();