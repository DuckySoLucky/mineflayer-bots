const mineflayer = require('mineflayer')
const config = require('./config')
let nowFishing = false
const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,   
    username: config.username,    
    password: config.password,         
    version: false,             
    auth: config.auth          
})

let mcData
bot.on('inject_allowed', () => {
  mcData = require('minecraft-data')(bot.version)
})


bot.on('message', (msg) => {
    if (msg.toString().includes('start')) {
      startFishing()
    }if (msg.toString().includes('stop')) {
      stopFishing()
    }
})
  
function onCollect () {
    startFishing()
}

async function startFishing () {
    try {
        await bot.equip(mcData.itemsByName.fishing_rod.id, 'hand')
    } catch (err) {
        return bot.chat(err.message)
    }

    nowFishing = true
    bot.on('playerCollect', onCollect)

    try {
        await bot.fish()
    } catch (err) {
        console.log(err.message)
    }
    nowFishing = false
}

function stopFishing () {
    if (nowFishing) {
        bot.activateItem()
    }
}


bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', console.log)