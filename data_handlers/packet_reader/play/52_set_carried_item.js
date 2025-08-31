const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:set_carried_item / 52 packet (${length} bytes)`)

    var slot = reader.ReadShort(data, 0).value

    if (socket.playerInventory.selected_inventory == "main") socket.playerInventory.selected_slot = slot + 36
    else if (socket.playerInventory.selected_inventory == "createPlayer") socket.playerInventory.selected_slot_create_player = slot + 36
    else if (socket.playerInventory.selected_inventory == "createPlayerAuto") socket.playerInventory.selected_slot_create_player_auto = slot + 36
}
module.exports = {read}