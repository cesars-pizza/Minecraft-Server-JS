const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number[]} ids  
 * @param {Socket} socket
 */
function write(socket, ids) {
    socket.writePacket(70, "minecraft:remove_entities", get(ids))
}

/** 
 * @param {number[]} ids
 * @param {Socket} socket
 */
function buffer(socket, ids) {
    socket.bufferPacket(70, "minecraft:remove_entities", get(ids))
}

function get(ids) {
    var data = writer.WriteVarInt(ids.length)
    for (var i = 0; i < ids.length; i++) {
        data = data.concat(writer.WriteVarInt(ids[i]))
    }
    return data
}

module.exports = {write, buffer}