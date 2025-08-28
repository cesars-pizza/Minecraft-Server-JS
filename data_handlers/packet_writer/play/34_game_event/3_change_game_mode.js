const { Socket } = require("../../../../data_structures")
const writer = require("../../../data_writer")

/** 
 * @param {"Survival" | "Creative" | "Adventure" | "Spectator" | 0 | 1 | 2 | 3} value 
 * @param {Socket} socket
 */
function write(socket, value) {
    socket.writePacket(34, "minecraft:game_event", get(value))
}

/** 
 * @param {"Survival" | "Creative" | "Adventure" | "Spectator" | 0 | 1 | 2 | 3} value 
 * @param {Socket} socket
 */
function buffer(socket, value) {
    socket.bufferPacket(34, "minecraft:game_event", get(value))
}

function get(value) {
    if (typeof(value) == "string") {
        if (value.toLowerCase() == "survival") value = 0
        else if (value.toLowerCase() == "creative") value = 1
        else if (value.toLowerCase() == "adventure") value = 2
        else if (value.toLowerCase() == "spectator") value = 3
    }
    return writer.WriteUByte(3).concat(writer.WriteFloat(value))
}

module.exports = {write, buffer}