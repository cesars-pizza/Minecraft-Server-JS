const { Socket } = require("../../../data_structures")
const { WriteVarInt } = require("../../data_writer")

/** 
 * @param {number} sequenceID  
 * @param {Socket} socket
 */
function write(socket, sequenceID) {
    socket.writePacket(4, "minecraft:block_changed_ack", get(sequenceID))
}

/** 
 * @param {number} sequenceID  
 * @param {Socket} socket
 */
function buffer(socket, sequenceID) {
    socket.bufferPacket(4, "minecraft:block_changed_ack", get(sequenceID))
}

function get(sequenceID) {
    return WriteVarInt(sequenceID)
}

module.exports = {write, buffer}