const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number} slotID 
 * @param {number} itemCount 
 * @param {number | string} itemID 
 * @param {Socket} socket
 */
function write(socket, slotID, itemCount, itemID) {
    socket.writePacket(101, "minecraft:set_player_inventory", get(slotID, itemCount, itemID))
}

/**
 * @param {number} slotID 
 * @param {number} itemCount 
 * @param {number | string} itemID 
 * @param {Socket} socket
 */
function buffer(socket, slotID, itemCount, itemID) {
    socket.bufferPacket(101, "minecraft:set_player_inventory", get(slotID, itemCount, itemID))
}

function get(slotID, itemCount, itemID) {
    return writer.WriteVarInt(slotID).concat(writer.WriteSlot(itemCount, itemID))
}

module.exports = {write, buffer}