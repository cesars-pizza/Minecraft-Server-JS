const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const chunkPacketHelper = require('../../../helpers/writeChunkPacket.js')
const registryReader = require('../../registry_reader.js')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:chat / 8 packet (${length} bytes)`)

    var message = reader.ReadString(data, 0)

    var messageCoors = message.value.split(', ').map((value) => {return Number(value)})

    if (message.value == 'new') {
        socket.bufferPacket(0x27, "minecraft:level_chunk_with_light", chunkPacketHelper.CreatePlatformChunk(0, 0, -64, 16, 1 + Math.floor(Math.random() * 27000), 15))
        socket.markLoadedChunk(0, 0)
    } else if (message.value == 'load all') {
        var loadSize = Math.ceil(Math.sqrt(Math.ceil((registryReader.getBlockStateIDMax() + 1) / 256)))

        socket.loadAll = {
            enabled: true,
            loadSize: loadSize,
            chunkZ: -1
        }
    } else if (messageCoors[0] != NaN && messageCoors[1] != NaN && messageCoors.length == 2) {
        socket.bufferPacket(0x27, "minecraft:level_chunk_with_light", chunkPacketHelper.CreatePlatformChunk(messageCoors[0], messageCoors[1], -64, 16, 1, 15))
        socket.markLoadedChunk(messageCoors[0], messageCoors[1])

        for (var x = -1; x <= 1; x++) {
            for (var z = -1; z <= 1; z++) {
                if (!socket.getChunkLoaded(messageCoors[0] + x, messageCoors[1] + z)) {
                    socket.bufferPacket(0x27, "minecraft:level_chunk_with_light", chunkPacketHelper.CreateEmptyChunk(messageCoors[0] + x, messageCoors[1] + z))
                    socket.markLoadedChunk(messageCoors[0] + x, messageCoors[1] + z)
                }
            }
        }
    } else if (message.value == "reset") {
        packetWriter.play.transfer.buffer(socket, "localhost", 25565)
    }
}
module.exports = {read}