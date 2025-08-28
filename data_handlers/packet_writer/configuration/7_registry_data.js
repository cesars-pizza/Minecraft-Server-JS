const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {string} registryID 
 * @param {{entryID: string, data: number[] | null}[]} entries 
 * @param {Socket} socket
 */
function write(socket, registryID, entries) {
    socket.writePacket(7, "minecraft:registry_data", get(registryID, entries))
}

/**
 * @param {string} registryID 
 * @param {{entryID: string, data: number[] | null}[]} entries 
 * @param {Socket} socket
 */
function buffer(socket, registryID, entries) {
    socket.bufferPacket(7, "minecraft:registry_data", get(registryID, entries))
}

function get(registryID, entries) {
    var data = writer.WriteIdentifier(registryID).concat(writer.WriteVarInt(entries.length))
    for (var i = 0; i < entries.length; i++) {
        data = data.concat(
            writer.WriteIdentifier(entries[i].entryID),
            (entries[i].data == null || entries[i].data == undefined) ? writer.WriteBool(false) : writer.WriteBool(true).concat(entries[i].data)
        )
    }
    return data
}

module.exports = {write, buffer}