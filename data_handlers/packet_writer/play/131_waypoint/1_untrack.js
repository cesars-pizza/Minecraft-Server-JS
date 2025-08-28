const { Socket } = require("../../../../data_structures")
const writer = require("../../../data_writer")

/**
 * @param {number | bigint | string} id 
 * @param {"UUID" | "String"} idType
 * @param {Socket} socket
 */
function write(socket, id, idType) {
    socket.writePacket(131, "minecraft:waypoint", get(id, idType))
}

/**
 * @param {number | bigint | string} id 
 * @param {"UUID" | "String"} idType
 * @param {Socket} socket
 */
function buffer(socket, id, idType) {
    socket.bufferPacket(131, "minecraft:waypoint", get(id, idType))
}

function get(id, idType) {
    data = writer.WriteVarInt(1)

    if (idType.toLowerCase() == 'uuid') {
        if (typeof(id) == 'string') data = data.concat(writer.WriteBool(true), writer.WriteUUIDv3(id))
        else data = data.concat(writer.WriteBool(true), writer.WriteUUID(id))
    } else data = data.concat(writer.WriteBool(false), writer.WriteString(id))

    data.concat(writer.WriteIdentifier("minecraft:default"), writer.WriteBool(false), writer.WriteVarInt(0))
}

module.exports = {write, buffer}