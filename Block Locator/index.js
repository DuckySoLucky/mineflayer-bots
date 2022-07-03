const mineflayer = require('mineflayer')
const config = require('./config')
const { pathfinder, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock

const bot = mineflayer.createBot({
    host: config.host,
    port: config.port,   
    username: config.username,    
    password: config.password,         
    version: false,             
    auth: config.auth          
})

bot.loadPlugin(pathfinder)
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', console.log)

bot.on('message', (msg) => {
    if (msg.toString().includes('find')) {
        locateBlock()
    }
})

async function locateBlock() {
    await bot.waitForChunksToLoad()
    const block = bot.findBlocks({
        matching: block => block.name.includes(config.block),
        maxDistance: config.distance,
        count: config.count,
    })
    console.log(block)
    const x = block[0].x
    const y = block[0].y + 1
    const z = block[0].z
    const goal = new GoalBlock(x, y, z)
    bot.pathfinder.setGoal(goal)
}