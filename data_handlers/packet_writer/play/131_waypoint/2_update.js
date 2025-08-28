const { Socket } = require("../../../../data_structures")
const writer = require("../../../data_writer")

/**
 * @param {number | bigint | string} id 
 * @param {"UUID" | "String"} idType 
 * @param {"minecraft:default" | "minecraft:bowtie" | string} iconStyle 
 * @param {{r: number, g: number, b: number} | null} color 
 * @param {{x: number, y: number, z: number} | {x: number, z: number} | {angle: number}} position 
 * @param {Socket} socket
 */
function write(socket, id, idType, iconStyle, color, position) {
    socket.writePacket(131, "minecraft:waypoint", get(id, idType, iconStyle, color, position))
}

/**
 * @param {number | bigint | string} id 
 * @param {"UUID" | "String"} idType 
 * @param {"minecraft:default" | "minecraft:bowtie" | string} iconStyle 
 * @param {{r: number, g: number, b: number} | null} color 
 * @param {{x: number, y: number, z: number} | {x: number, z: number} | {angle: number}} position 
 * @param {Socket} socket
 */
function buffer(socket, id, idType, iconStyle, color, position) {
    socket.bufferPacket(131, "minecraft:waypoint", get(id, idType, iconStyle, color, position))
}

function get(id, idType, iconStyle, color, position) {
    data = writer.WriteVarInt(2)

    if (idType.toLowerCase() == 'uuid') {
        if (typeof(id) == 'string') data = data.concat(writer.WriteBool(true), writer.WriteUUIDv3(id))
        else data = data.concat(writer.WriteBool(true), writer.WriteUUID(id))
    } else data = data.concat(writer.WriteBool(false), writer.WriteString(id))

    data.concat(writer.WriteIdentifier(iconStyle))

    if (color == null || color == undefined) data = data.concat(writer.WriteBool(false))
    else data = data.concat(writer.WriteBool(true), writer.WriteUByte(color.r), writer.WriteUByte(color.g), writer.WriteUByte(color.b))

    if (position.y != null && position.y != undefined) data = data.concat(writer.WriteVarInt(1), writer.WriteVarInt(position.x), writer.WriteVarInt(position.y), writer.WriteVarInt(position.z))
    else if (position.angle != null && position.angle != undefined) data = data.concat(writer.WriteVarInt(3), writer.WriteVarInt(position.angle))
    else data = data.concat(writer.WriteVarInt(2), writer.WriteVarInt(position.x), writer.WriteVarInt(position.z))
}

module.exports = {write, buffer}