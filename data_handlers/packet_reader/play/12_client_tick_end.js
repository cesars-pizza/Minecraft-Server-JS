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

    for (var i = 0; i < socket.npcPlayers.length; i++) {
        if (socket.npcPlayers[i].frames.length > 1) {
            var thisFrames = socket.npcPlayers[i].frames
            for (var j = 0; j < socket.npcPlayers[i].copies.length; j++) {
                socket.npcPlayers[i].copies[j]++
                if (socket.npcPlayers[i].copies[j] == thisFrames.length) socket.npcPlayers[i].copies[j] = 0
                var copyFrame = socket.npcPlayers[i].copies[j]

                if (socket.npcPlayers[i].copies[j] > 0) {
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