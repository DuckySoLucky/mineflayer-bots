const { MessageEmbed, WebhookClient } = require('discord.js')
const client = new WebhookClient({ id: 'ID', token: 'TOKEN' })
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const mineflayer = require('mineflayer')
let warping = 0, forcedMove = 0, capcha = false


const bot = mineflayer.createBot({
    host: 'SERVER_IP',
    port: 25565,  
    auth: "microsoft",  
    //username: "Bot",  
    version: false,                                    
})

const forceTeleport = new MessageEmbed()
    .setColor('#00FF00')
    .setAuthor({ name: 'Teleport'})
    .setDescription(`Bot has been teleported`)
    .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })

const capchaWarning = new MessageEmbed()
    .setColor('#00FF00')
    .setAuthor({ name: 'Capcha'})
    .setDescription(`Bot has received Capcha request`)
    .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })

const disconnectEmbed = new MessageEmbed()
    .setColor('#00FF00')
    .setAuthor({ name: 'Disconnect'})
    .setDescription(`Bot has disconnected`)
    .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })

const warpedOut  = new MessageEmbed()
    .setColor('#00FF00')
    .setAuthor({ name: 'Warped Out'})
    .setDescription(`Bot has been warped out, server reboot might be happening.`)
    .setFooter({ text: 'by DuckySoLucky#5181', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/164084b936b4461fe9505398f7383a0e.png?size=4096' })


bot.on('message', async (msg) => {
    if (msg.toString().includes('Qwack_Bot')) {
        const message = msg.toString().split(': ') // ':§r ' 
        if (message[1] == 'hey can u mine?') {
            if (bot.world.getBlock(bot.entity.position.offset(0, -1, 0)).name == 'hopper') {
                console.log('Minecraft > Successfully Started Mining Bot')
                await bot.look(-90, Math.PI/2, false)
                dig()
                bot.setControlState('forward', true) 
                bot.setControlState('sprint', true)
                setInterval(async () => {
                    if (bot.world.getBlock(bot.entity.position.offset(-1, 0, 0)).name == 'oak_trapdoor') await bot.look(180, Math.PI/2, false)
                    else if (bot.world.getBlock(bot.entity.position.offset(1, 0, 0)).name == 'glass') await bot.look(90, Math.PI/2, false)
                }, 1)
            } else {
                console.log('Minecraft > An Error has Occurred: Block below me is not a hopper')
            }
        } else {
            bot.chat(message[1])
        }
    }
})

bot.on('forcedMove', async () => { 
    forcedMove++
    if (forcedMove > 1) {
        console.log('Discord > Bot has been teleported')
        await delay(900)
        bot.setControlState('forward', false)
        const target = bot.nearestEntity(entity => entity.name.toLowerCase() === 'player')
        target.position.y+=2
        await bot.lookAt(target.position, false)
        await delay(4900)
        bot.chat('bro wtf this is like 10th time today im done with this server')
        client.send({ content: '@everyone', embeds: [ forceTeleport ]})
    }
})

async function dig() {
    if (!capcha) {
        if (bot.world.getBlock(bot.entity.position.offset(0, -1, 0)).name == 'hopper') {
            if (!bot.heldItem || bot.heldItem.nbt.value.Damage.value > 1500) {
                var pickaxe = bot.inventory.items().filter(i => i.name.includes('pickaxe'))
                for (let i = 0; i < pickaxe.length; i++) {
                    if (pickaxe[i].nbt.value.Damage.value < 1500) {
                        await bot.equip(pickaxe[i], 'hand')
                        console.log('Minecraft >  Successfully switched to new pickaxe')
                        dig()
                        break
                    }     
                    if (i+1 == pickaxe.length) {
                        bot.quit()
                        console.log('Minecraft > All pickaxes in bot\' inventory have been used.')
                    }
                }

            } else {
                const block = bot.blockAtCursor(4)
                if (!block) return setTimeout(function() {
                    dig()
                }, 100)
                await bot.dig(block, 'ignore', 'raycast')
                dig()
            }  
        } else {
            console.log('Discord > Bot has been teleported')
            await delay(900)
            bot.setControlState('forward', false)
            const target = bot.nearestEntity(entity => entity.name.toLowerCase() === 'player')
            target.position.y+=2
            await bot.lookAt(target.position, false)
            await delay(4900)
            bot.chat('bro wtf this is like 10th time today im done with this server')
            client.send({ content: '@everyone', embeds: [ forceTeleport ]})
        }
    }
}



bot.on('spawn', async () => {
    warping++
    if (warping == 1) {
        console.log(`Minecraft > Client Ready, Logged in as ${bot.username}`)
        bot.chat('/server skyblock')
    } else if (warping == 2) {
        console.log('Minecraft > Successfully warped to Skyblock')
    } else {
        console.log(warping)
        client.send({ content: '@everyone', embeds: [ warpedOut ]})
    }
    
})

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

bot.on('windowOpen', async () => {
    console.log('Discord > Bot has received Capcha request')
    capcha = true
    bot.setControlState('forward', false)
    client.send({ content: '@everyone', embeds: [ capchaWarning ]})
})

bot.on('kicked', (message) => client.send({ content: `@everyone\nBot has been disconnected due to \`${message.replaceAll('{"text":"', '').replaceAll('"}','')}\``, embeds: [ disconnectEmbed ]}))
