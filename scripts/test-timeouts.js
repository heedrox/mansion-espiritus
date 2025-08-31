const DroneResponseGenerator = require('../multiscapes/domain/DroneResponseGenerator');
const dotenv = require('dotenv');

dotenv.config();
const messages = [
    {
        message: "examina el acantilado",
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
            console.log('num of correct responses:', num);
        } catch (error) {
            console.log('❌ AI call failed or timed out:', error.message);
            process.exit(1);
            return;
        }
    }
})();