const writer = require('../../data_writer.js')
const chunkPacketHelper = require('../../../helpers/writeChunkPacket.js')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:finish_configuration / 3 packet (${length} bytes)`)

    socket.setState('play')
    
    packetWriter.play.login.write(socket, 0, false, {dimensionNames: ["minecraft:overworld"], currentDimensionID: 0, currentDimensionName: "minecraft:overworld"}, 999, 32, 32, false, true, false, 0, {current: "Creative", previous: null}, false, false, null, 0, 64, false)
    
    packetWriter.play.game_event.start_waiting_for_level_chunks.write(socket)
    socket.writePacket(0x27, "minecraft:level_chunk_with_light", chunkPacketHelper.CreatePlatformChunk(0, 0, -64, 16, 1, 15))
    socket.markLoadedChunk(0, 0)
    for (var x = -2; x < 3; x++) {
        for (var z = -2; z < 3; z++) {
            if (x | z != 0) {
                socket.writePacket(0x27, "minecraft:level_chunk_with_light", chunkPacketHelper.CreateEmptyChunk(x, z))
                socket.markLoadedChunk(x, z)
            }
        }
    }
}
module.exports = {read}