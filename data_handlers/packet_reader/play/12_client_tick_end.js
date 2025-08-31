const writer = require('../../data_writer.js')
const nbt = require('../../nbt_writer.js')
const chunkPacketHelper = require('../../../helpers/writeChunkPacket.js')
const registryReader = require('../../registry_reader.js')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')


/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log("", false)
    socket.log(`INCOMING minecraft:client_tick_end / 12 packet (${length} bytes)`, false)

    if (socket.loadAll.enabled) {
        for (var chunkX = -1; chunkX <= socket.loadAll.loadSize; chunkX++) {
            if (chunkX == -1 || chunkX == socket.loadAll.loadSize || socket.loadAll.chunkZ == -1 || socket.loadAll.chunkZ == socket.loadAll.loadSize) {
                socket.bufferPacket(0x27, "minecraft:level_chunk_with_light", chunkPacketHelper.CreateEmptyChunk(chunkX, socket.loadAll.chunkZ))
                socket.markLoadedChunk(chunkX, socket.loadAll.chunkZ)
            } else {
                var blocks = Array(384).fill(Array(16).fill(Array(16).fill(0)), 1)
                var heightmaps = Array(16).fill(Array(16).fill(1))
                var blockCounts = [256, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                var biomes = Array(384 / 4).fill(Array(4).fill(Array(4).fill(0)))
                var lights = Array(384 + 32).fill(Array(16).fill(Array(16).fill(13)))
                
                blocks[0] = []

                for (var blockZ = 0; blockZ < 16; blockZ++) {
                    blocks[0].push([])
                    for (var blockX = 0; blockX < 16; blockX++) {
                        var x = chunkX * 16 + blockX
                        var z = socket.loadAll.chunkZ * 16 + blockZ

                        var blockIndex = z * 16 * socket.loadAll.loadSize + x
                        if (blockIndex > registryReader.getBlockStateIDMax()) blockIndex = 0

                        blocks[0][blockZ][blockX] = blockIndex
                    }
                }
                var chunkDataBytes = writer.WriteChunkData(384, heightmaps, heightmaps, heightmaps, blockCounts, blocks, biomes)
                var lightDataBytes = writer.WriteLightData(lights, lights)

                packetWriter.play.level_chunk_with_light.buffer(socket, chunkX, socket.loadAll.chunkZ, chunkDataBytes, lightDataBytes)
                socket.markLoadedChunk(chunkX, socket.loadAll.chunkZ)
            }
        }

        socket.loadAll.chunkZ++
        if (socket.loadAll.chunkZ > socket.loadAll.loadSize) {
            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("type", "text"),
                nbt.WriteString("text", `Loaded All ${registryReader.getBlockStateIDMax() + 1} Block States`),
            ]), false)
            socket.loadAll.enabled = false
        }
    }

    if (socket.playerInventory.selected_inventory == "createPlayerAuto" && socket.createPlayerAutoSettings.state > 0) {
        if (socket.createPlayerAutoSettings.state == 1) {
            socket.createPlayerAutoSettings.play_time++
            if (socket.createPlayerAutoSettings.syncronization_index >= 0 && socket.createPlayerAutoSettings.play_time <= 0) socket.npcSync[socket.createPlayerAutoSettings.syncronization_index] = -1

            if (socket.createPlayerAutoSettings.play_time == 0) {
                packetWriter.play.sound.buffer(socket, 534, "master", socket.playerPos, 1, 1.15, Math.floor(Math.random() * 10000))
                packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                    nbt.WriteString("text", `GO`)
                ]), true)

                packetWriter.play.add_entity.buffer(socket, socket.tick, socket.tick, 145, socket.playerPos.x, socket.playerPos.y, socket.playerPos.z, socket.playerPos.pitch, socket.playerPos.yaw, socket.playerPos.yaw, 0, 0, 0, 0)
                socket.createPlayerAutoSettings.marker_entities.push(socket.tick)
            }

            if (socket.createPlayerAutoSettings.play_time >= 0) {
                if (socket.createPlayerAutoSettings.syncronization_index < 0 || socket.createPlayerAutoSettings.play_time < socket.npcSyncLengths[socket.createPlayerAutoSettings.syncronization_index]) {
                    socket.createPlayerAutoSettings.raw_frames.push({
                        x: socket.playerPos.x,
                        y: socket.playerPos.y,
                        z: socket.playerPos.z,
                        pitch: socket.playerPos.pitch,
                        yaw: socket.playerPos.yaw
                    })

                    if (socket.createPlayerAutoSettings.play_time % 20 == 0 && socket.createPlayerAutoSettings.play_time != 0) {
                        var seconds = 0
                        var minutes = 0
                        if (socket.createPlayerAutoSettings.syncronization_index >= 0) {
                            var ticksLeft = socket.npcSyncLengths[socket.createPlayerAutoSettings.syncronization_index] - socket.createPlayerAutoSettings.play_time
                            seconds = (ticksLeft % 1200) / 20
                            minutes = Math.floor(ticksLeft / 1200)
                        } else {
                            seconds = (socket.createPlayerAutoSettings.play_time % 1200) / 20
                            minutes = Math.floor(socket.createPlayerAutoSettings.play_time / 1200)
                        }

                        if (minutes > 0) packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                            nbt.WriteString("text", `${minutes}:${seconds.toString().padStart(2, "0")}`)
                        ]), true)
                        else packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                            nbt.WriteString("text", seconds.toString())
                        ]), true)
                    }
                }
            }
            else if ((socket.createPlayerAutoSettings.play_time * -1) % 20 == 0) {
                packetWriter.play.sound.buffer(socket, 534, "master", socket.playerPos, 1, 1, Math.floor(Math.random() * 10000))
                packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                    nbt.WriteString("text", `${socket.createPlayerAutoSettings.play_time * -0.05}...`)
                ]), true)
            }

            if (socket.createPlayerAutoSettings.syncronization_index >= 0 && socket.createPlayerAutoSettings.play_time == socket.npcSyncLengths[socket.createPlayerAutoSettings.syncronization_index]) {
                socket.createPlayerAutoSettings.state = 2

                packetWriter.play.set_player_inventory.buffer(socket, 7, 1, "minecraft:name_tag")
                packetWriter.play.set_player_inventory.buffer(socket, 8, 1, "minecraft:emerald")

                packetWriter.play.sound.buffer(socket, 534, "master", socket.playerPos, 1, 1.15, Math.floor(Math.random() * 10000))

                packetWriter.play.add_entity.buffer(socket, socket.tick, socket.tick, 145, socket.playerPos.x, socket.playerPos.y, socket.playerPos.z, socket.playerPos.pitch, socket.playerPos.yaw, socket.playerPos.yaw, 0, 0, 0, 0)
                socket.createPlayerAutoSettings.marker_entities.push(socket.tick)
            }
        }
    }

    for (var i = 0; i < socket.npcSync.length; i++) {
        socket.npcSync[i]++
        if (socket.npcSync[i] >= socket.npcSyncLengths[i]) { socket.npcSync[i] = 0 }
    }

    for (var i = 0; i < socket.npcPlayers.length; i++) {
        if (socket.npcPlayers[i].frames.length > 1) {
            var thisFrames = socket.npcPlayers[i].frames
            for (var j = 0; j < socket.npcPlayers[i].copies.length; j++) {
                if (socket.npcPlayers[i].sync < 0) socket.npcPlayers[i].copies[j]++
                if (socket.npcPlayers[i].copies[j] == thisFrames.length) socket.npcPlayers[i].copies[j] = 0
                var copyFrame = socket.npcPlayers[i].copies[j]
                if (socket.npcPlayers[i].sync >= 0) copyFrame = socket.npcSync[socket.npcPlayers[i].sync]

                if (copyFrame > 0) {
                    if (thisFrames[copyFrame].changedRot && thisFrames[copyFrame].changedPos) {
                        packetWriter.play.move_entity_pos_rot.buffer(socket, socket.npcPlayers[i].id, thisFrames[copyFrame].x, thisFrames[copyFrame].y, thisFrames[copyFrame].z, thisFrames[copyFrame].pitch, thisFrames[copyFrame].yaw, false)
                    } else if (thisFrames[copyFrame].changedPos) {
                        packetWriter.play.move_entity_pos.buffer(socket, socket.npcPlayers[i].id, thisFrames[copyFrame].x, thisFrames[copyFrame].y, thisFrames[copyFrame].z, false)
                    } else if (thisFrames[copyFrame].changedRot) {
                        packetWriter.play.move_entity_pos_rot.buffer(socket, socket.npcPlayers[i].id, thisFrames[copyFrame].pitch, thisFrames[copyFrame].yaw, false)
                    }
                } else {
                    packetWriter.play.entity_position_sync.buffer(socket, socket.npcPlayers[i].id, thisFrames[copyFrame], {x: 0, y: 0, z: 0}, thisFrames[copyFrame])
                }
            }
        }
    }

    socket.tick++
    socket.writeBufferedPackets()
}
module.exports = {read}