const crypto = require('crypto')

const createConversation = () => ({
    data: {
        numCommands: 0,
        roomId: null,
        starttTime: null,
        inventory: [],
        picked: [],
        sessionId: crypto.randomBytes(16).toString("hex")
    }    
})


module.exports = {
    createConversation
}
