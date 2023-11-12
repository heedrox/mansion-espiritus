const createConversation = () => ({
    data: {}    
})

const getConv = () => global.conv ? global.conv : createConversation();

module.exports = {
    getConv
}
