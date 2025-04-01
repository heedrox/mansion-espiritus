const { walk } = require('./walk.js')
const { look } = require('./look.js')
const { pickup } = require('./pickup.js')
const { use } = require('./use.js')
const { inventory } = require('./inventory.js')
const { help } = require('./help.js')
const { fallback } = require('./fallback.js')
const { welcome } = require('./welcome.js')
const { bye } = require('./bye.js')
const { timeOver } = require('./time-over.js')
const { answer } = require('./answer.js')
const { say } = require('./say.js')

module.exports = {
    walk,
    look,
    pickup,
    use,
    inventory,
    help,
    fallback,
    welcome,
    bye,
    timeOver,
    answer,
    say
}