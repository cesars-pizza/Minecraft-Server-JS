const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const nbt = require('../../nbt_writer.js')
const packetWriter = require('../../packet_writer/class.js')
const registryReader = require('../../registry_reader.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:sign_update / 59 packet (${length} bytes)`)

    var location = reader.ReadPosition(data, 0)
    var isFront = reader.ReadBool(data, location.nextPos)
    var line1 = reader.ReadString(data, isFront.nextPos)
    var line2 = reader.ReadString(data, line1.nextPos)
    var line3 = reader.ReadString(data, line2.nextPos)
    var line4 = reader.ReadString(data, line3.nextPos)

    if (socket.playerInventory.selected_inventory == "createPlayer") {
        packetWriter.play.block_update.buffer(socket, location.value.x, location.value.y, location.value.z, 0)

        var fullText = line1.value.concat(line2.value, line3.value, line4.value)
        var entityText = registryReader.getEntityTypeID(fullText)
        if (fullText != "" && entityText == undefined && fullText.length <= 16) {
            socket.createPlayerSettings.name = fullText

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("text", `Set NPC to Player ${fullText}`),
            ]), true)
        } else if (entityText != undefined) {
            socket.createPlayerSettings.name = fullText

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("text", `Set NPC to Entity ${fullText}`),
            ]), true)
        } else if (fullText.length > 16) {
            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("text", `NPC Name Too Long: ${fullText} (Max 16 Chars.)`),
            ]), true)
        }
    } else if (socket.playerInventory.selected_inventory == "createPlayerAuto") {
        packetWriter.play.block_update.buffer(socket, location.value.x, location.value.y, location.value.z, 0)

        var fullText = line1.value.concat(line2.value, line3.value, line4.value)
        var entityText = registryReader.getEntityTypeID(fullText)
        if (fullText != "" && entityText == undefined && fullText.length <= 16) {
            socket.createPlayerAutoSettings.name = fullText

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("text", `Set NPC to Player ${fullText}`),
            ]), true)
        } else if (entityText != undefined) {
            socket.createPlayerAutoSettings.name = fullText

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("text", `Set NPC to Entity ${fullText}`),
            ]), true)
        } else if (fullText.length > 16) {
            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("text", `NPC Name Too Long: ${fullText} (Max 16 Chars.)`),
            ]), true)
        }
    }
}
module.exports = {read}