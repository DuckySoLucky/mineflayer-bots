const mineflayer = require('mineflayer')
const config = require('./config.json')
const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,   
    username: config.username,    
    password: config.password,         
    version: false,             
    auth: config.auth                         
})

bot.on('message', (msg) => {
    if (msg.toString().includes('dig')) {
        dig()
    }
})

async function dig () {
    for (let i = 1; i < (config.radius+1); i++) {    
        const target = bot.blockAt(bot.entity.position.offset(0, 1, i))
        if (target && bot.canDigBlock(target)) {
            try {
                await bot.dig(target)
                if (bot.blockAt(bot.entity.position.offset(0, 1, 1)).name == 'cobblestone') {
                    dig()
                    break
                } 
                else if (i == config.radius) {
                    dig()
                    break
                }
            } catch (err) {
                console.log(err.stack)
            }
        } 
    }
}