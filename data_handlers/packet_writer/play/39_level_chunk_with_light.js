const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number} x 
 * @param {number} z 
 * @param {number[]} chunkData 
 * @param {number[]} lightData 
 * @param {Socket} socket
 */
function write(socket, x, z, chunkData, lightData) {
    socket.writePacket(39, "minecraft:level_chunk_with_light", get(x, z, chunkData, lightData))
}

/**
 * @param {number} x 
 * @param {number} z 
 * @param {number[]} chunkData 
 * @param {number[]} lightData 
 * @param {Socket} socket
 */
function buffer(socket, x, z, chunkData, lightData) {
    socket.bufferPacket(39, "minecraft:level_chunk_with_light", get(x, z, chunkData, lightData))
}

function get(x, z, chunkData, lightData) {
    return writer.WriteInt(x).concat(
        writer.WriteInt(z),
        chunkData,
        lightData
    )
}

module.exports = {write, buffer}