const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const registryReader = require('../../registry_reader.js')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:set_creative_mode_slot / 55 packet (${length} bytes)`)

    var slot = reader.ReadShort(data, 0)
    var clickedItem = reader.ReadSlot(data, slot.nextPos)

    var itemID = clickedItem.value.id
    if (socket.playerInventory.selected_inventory == "main") {
        socket.playerInventory.slots[slot.value] = itemID
        socket.playerInventory.slot_counts[slot.value] = clickedItem.value.count
    } else if (socket.playerInventory.selected_inventory == "createPlayer") {
        if (slot.value == 36) packetWriter.play.set_player_inventory.buffer(socket, 0, 1, "minecraft:stick")
        else if (slot.value == 37) packetWriter.play.set_player_inventory.buffer(socket, 1, 0, null)
        else if (slot.value == 38) packetWriter.play.set_player_inventory.buffer(socket, 2, 1, "minecraft:flint_and_steel")
        else if (slot.value == 39) packetWriter.play.set_player_inventory.buffer(socket, 3, 1, "minecraft:lava_bucket")
        else if (slot.value == 40) packetWriter.play.set_player_inventory.buffer(socket, 4, 1, "minecraft:tnt")
        else if (slot.value == 41) packetWriter.play.set_player_inventory.buffer(socket, 5, 0, null)
        else if (slot.value == 42) packetWriter.play.set_player_inventory.buffer(socket, 6, 1, "minecraft:clock")
        else if (slot.value == 43) packetWriter.play.set_player_inventory.buffer(socket, 7, 1, "minecraft:name_tag")
        else if (slot.value == 44) packetWriter.play.set_player_inventory.buffer(socket, 8, 1, "minecraft:diamond")
        else {
            socket.playerInventory.slots[slot.value] = itemID
            socket.playerInventory.slot_counts[slot.value] = clickedItem.value.count
        }
    }
}
module.exports = {read}