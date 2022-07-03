const mineflayer = require('mineflayer')
const config = require('./config.json')
const { Vec3 } = require('vec3')

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

function findFarmland() {
    return bot.findBlock({
        point: bot.entity.position,
        matching: mcData.blocksByName.farmland.id,
        maxDistance: config.radius,
        useExtraInfo: (block) => {
            const blockAbove = bot.blockAt(block.position.offset(0, 1, 0))
            return blockAbove.type === 0 || !blockAbove 
        }
    })
}

function harvest() {
    return bot.findBlock({
      point: bot.entity.position,
      maxDistance: config.radius,
      matching: (block) => {
        return block && block.type === mcData.blocksByName.wheat.id && block.metadata === 7
      }
    })
}

async function farm() {
    try {
        while (true) {
            const harvestableCrops = harvest()
            if (harvestableCrops) {
                await bot.dig(harvestableCrops)
            } else {
                break
            }
        }
        while (true) {
            const plant = findFarmland()
            if (plant) {
                await bot.equip(mcData.itemsByName.wheat_seeds.id, 'hand')
                await bot.placeBlock(plant, new Vec3(0, 1, 0))
            } else {
                break
            }
        }
    }catch(error) {console.log(error)}
    setTimeout(farm, 500)
}
  

bot.once('spawn', farm)