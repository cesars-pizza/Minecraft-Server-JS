const { Socket } = require('../../../data_structures.js')
const writer = require('../../data_writer.js')

/**
 * @param {bigint | number | null} uuid 
 * @param {string} username 
 * @param {{name: string, value: string, signature: string | null}[]} properties 
 * @param {Socket} socket
 */
function write(socket, uuid, username, properties) {
    socket.writePacket(2, "minecraft:login_finished", get(uuid, username, properties))
}

/**
 * @param {bigint | number | null} uuid 
 * @param {string} username 
 * @param {{name: string, value: string, signature: string | null}[]} properties 
 * @param {Socket} socket
 */
function buffer(socket, uuid, username, properties) {
    socket.bufferPacket(2, "minecraft:login_finished", get(uuid, username, properties))
}

function get(uuid, username, properties) {
    var data = []
    if (typeof(uuid) == 'bigint' || typeof(uuid) == 'number') data = writer.WriteUUID(uuid).concat(writer.WriteString(username), writer.WriteVarInt(properties.length))
    else if (uuid == null) data = writer.WriteUUIDv3(`OfflinePlayer:${username}`).concat(writer.WriteString(username), writer.WriteVarInt(properties.length))
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].signature == null) data = data.concat(writer.WriteString(properties[i].name), writer.WriteString(properties[i].value), writer.WriteBool(false))
        else data = data.concat(writer.WriteString(properties[i].name), writer.WriteString(properties[i].value), writer.WriteBool(true), writer.WriteString(properties[i].signature))
    }
    return data
}

module.exports = {write, buffer}