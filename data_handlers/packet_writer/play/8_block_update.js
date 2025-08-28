const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")
const registryReader = require("../../registry_reader")

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number | string | {name: string, states: {}}} id 
 * @param {Socket} socket
 */
function write(socket, x, y, z, id) {
    socket.writePacket(8, "minecraft:block_update", get(x, y, z, id))
}

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number | string | {name: string, states: {}}} id 
 * @param {Socket} socket
 */
function buffer(socket, x, y, z, id) {
    socket.bufferPacket(8, "minecraft:block_update", get(x, y, z, id))
}

function get(x, y, z, id) {
    var position = writer.WritePosition(x, y, z)
    if (typeof(id) == 'number') return position.concat(writer.WriteVarInt(id))
    else if (typeof(id) == 'string') return position.concat(writer.WriteVarInt(registryReader.getBlockID(id, {})))
    else return position.concat(writer.WriteVarInt(registryReader.getBlockID(id.name, id.states)))
}

module.exports = {write, buffer}