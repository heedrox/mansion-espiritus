const createConversation = () => ({
    data: {
        numCommands: 0,
        roomId: null,
        starttTime: null,
        inventory: [],
        picked: []
    }    
})


module.exports = {
    createConversation
}
