const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/** 
 * @param {Socket} socket
 * @param {string | {version: {name: string | null, protocol: number}, players: {max: number, online: number, sample: {name: string, id: string}[] | null} | null, description: {} | null, favicon: string | null, enforcesSecureChat: boolean | null}} value 
 */
function write(socket, value) {
    socket.writePacket(0, "minecraft:status_response", get(value))
}

/**
 * @param {Socket} socket 
 * @param {string | {version: {name: string | null, protocol: number}, players: {max: number, online: number, sample: {name: string, id: string}[] | null} | null, description: {} | null, favicon: string | null, enforcesSecureChat: boolean | null}} value 
 */
function buffer(socket, value) {
    socket.bufferPacket(0, "minecraft:status_response", get(value))
}

function get(value) {
    if (typeof(value) == 'string') return writer.WriteString(value)
    else return writer.WriteString(JSON.stringify(value))
}

module.exports = {write, buffer}