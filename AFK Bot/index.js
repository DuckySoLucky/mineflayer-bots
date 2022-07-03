const mineflayer = require('mineflayer')
const autoeat = require('mineflayer-auto-eat')
const config = require('./config.json')

const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,   
    username: config.username,    
    password: config.password,         
    version: false,             
    auth: config.auth        
})


bot.loadPlugin(autoeat)

bot.once('spawn', () => {
    console.log('Client ready, Logged in as ' + bot.player.displayName)
    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 15, // 7.5
        bannedFood: []
    }
})
  
bot.on('health', () => {
    if (bot.food === 20) {
        bot.autoEat.disable()
    }
    else {
        bot.autoEat.enable()
    }
})