const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/** 
 * @param {{namespace: string, id: string, version: string}[]} packs 
 * @param {Socket} socket
 */
function write(socket, packs) {
    socket.writePacket(14, "minecraft:select_known_packs", get(packs))
}

/** 
 * @param {{namespace: string, id: string, version: string}[]} packs 
 * @param {Socket} socket
 */
function buffer(socket, packs) {
    socket.bufferPacket(14, "minecraft:select_known_packs", get(packs))
}

function get(packs) {
    var data = writer.WriteVarInt(packs.length)
    for (var i = 0; i < packs.length; i++) {
        data = data.concat(writer.WriteString(packs[i].namespace), writer.WriteString(packs[i].id), writer.WriteString(packs[i].version))
    }
    return data
}

module.exports = {write, buffer}