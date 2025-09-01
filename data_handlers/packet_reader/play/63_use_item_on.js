const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const chunkPacketHelper = require('../../../helpers/writeChunkPacket.js')
const registryReader = require('../../registry_reader.js')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')
const nbt = require('../../nbt_writer.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:use_item_on / 63 packet (${length} bytes)`)

    var hand = reader.ReadVarInt(data, 0)
    var location = reader.ReadPosition(data, hand.nextPos)
    var face = reader.ReadVarInt(data, location.nextPos)
    var cursorX = reader.ReadFloat(data, face.nextPos)
    var cursorY = reader.ReadFloat(data, cursorX.nextPos)
    var cursorZ = reader.ReadFloat(data, cursorY.nextPos)
    var insideBlock = reader.ReadBool(data, cursorZ.nextPos)
    var worldBorder = reader.ReadBool(data, insideBlock.nextPos)
    var sequence = reader.ReadVarInt(data, worldBorder.nextPos)

    if (face.value == 0) location.value.y--
    else if (face.value == 1) location.value.y++
    else if (face.value == 2) location.value.z--
    else if (face.value == 3) location.value.z++
    else if (face.value == 4) location.value.x--
    else if (face.value == 5) location.value.x++

    
    packetWriter.play.block_changed_ack.buffer(socket, sequence.value)
    if (socket.playerInventory.selected_inventory == "main") {
        var heldItemID = socket.playerInventory.slots[socket.playerInventory.selected_slot]
        var heldStatelessBlockID = registryReader.convertItemIDToBlockID(heldItemID)
        if (registryReader.getItemFromID(heldItemID) == "minecraft:armor_stand") {
            for (var i = 0; i < socket.waypoints.length; i++) {
                packetWriter.play.waypoint.untrack.buffer(socket, socket.waypoints[i], "String")
            }
            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("text", `Removed ${socket.waypoints.length} Waypoints`),
            ]), true)
            socket.waypoints = []
        } else if (!registryReader.getItemFromID(heldItemID).endsWith('concrete')) {
            packetWriter.play.block_update.buffer(socket, location.value.x, location.value.y, location.value.z, 0)
            if (heldStatelessBlockID != undefined || heldItemID == registryReader.getItemID("minecraft:stick") || heldItemID == registryReader.getItemID("minecraft:air") || heldItemID == registryReader.getItemID("minecraft:ender_eye") || heldItemID == registryReader.getItemID("minecraft:flint_and_steel") || heldItemID == registryReader.getItemID("minecraft:lava_bucket") || heldItemID == registryReader.getItemID("minecraft:water_bucket")) {
                if (face.value == 0 || face.value == 1) {
                    var chunkBlockX = location.value.x
                    var chunkBlockZ = location.value.z

                    while (chunkBlockX >= 16) chunkBlockX-=16
                    while (chunkBlockX < 0) chunkBlockX+=16
                    while (chunkBlockZ >= 16) chunkBlockZ-=16
                    while (chunkBlockZ < 0) chunkBlockZ+=16

                    if (chunkBlockX == 0) location.value.x--
                    else if (chunkBlockX == 15) location.value.x++

                    if (chunkBlockZ == 0) location.value.z--
                    else if (chunkBlockZ == 15) location.value.z++
                }
                
                var heldBlockID = 0
                if (heldStatelessBlockID != undefined) heldBlockID = registryReader.getBlockID(registryReader.getItemFromID(heldItemID), {})
                if (heldItemID == registryReader.getItemID("minecraft:ender_eye")) heldBlockID = Math.floor(Math.random() * (registryReader.getBlockStateIDMax() + 1))
                if (heldItemID == registryReader.getItemID("minecraft:flint_and_steel")) heldBlockID = registryReader.getBlockID("minecraft:fire", {})
                if (heldItemID == registryReader.getItemID("minecraft:lava_bucket")) heldBlockID = registryReader.getBlockID("minecraft:lava", {})
                if (heldItemID == registryReader.getItemID("minecraft:water_bucket")) heldBlockID = registryReader.getBlockID("minecraft:water", {})
                var chunkX = Math.floor(location.value.x / 16)
                var chunkZ = Math.floor(location.value.z / 16)
                
                socket.bufferPacket(0x27, "minecraft:level_chunk_with_light", chunkPacketHelper.CreatePlatformChunk(chunkX, chunkZ, -64, 16, heldBlockID, 15))
                socket.markLoadedChunk(chunkX, chunkZ)

                for (var x = -1; x <= 1; x++) {
                    for (var z = -1; z <= 1; z++) {
                        if (!socket.getChunkLoaded(chunkX + x, chunkZ + z)) {
                            socket.bufferPacket(0x27, "minecraft:level_chunk_with_light", chunkPacketHelper.CreateEmptyChunk(chunkX + x, chunkZ + z))
                            socket.markLoadedChunk(chunkX + x, chunkZ + z)
                        }
                    }
                }
            }
        } else if (location.value.y > -49) packetWriter.play.block_update.buffer(socket, location.value.x, location.value.y, location.value.z, registryReader.getItemFromID(heldItemID))
    } else if (socket.playerInventory.selected_inventory == "createPlayer") {
        if (socket.playerInventory.selected_slot_create_player == 39) {
            packetWriter.play.remove_entities.buffer(socket, socket.createPlayerSettings.marker_entities)

            socket.createPlayerSettings.marker_entities = []
            socket.createPlayerSettings.markers = []
            socket.createPlayerSettings.total_distance = 0

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("type", "text"),
                nbt.WriteString("text", `Removed All Markers`),
            ]), true)
        }
        else if (socket.playerInventory.selected_slot_create_player == 40) {
            socket.playerInventory.selected_inventory = "main"
            packetWriter.play.remove_entities.buffer(socket, socket.createPlayerSettings.marker_entities)
            packetWriter.play.set_held_slot.buffer(socket, socket.playerInventory.selected_slot - 36)
            for (var i = 36; i < 45; i++) {
                packetWriter.play.set_player_inventory.buffer(socket, i - 36, socket.playerInventory.slot_counts[i], socket.playerInventory.slots[i])
            }

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("type", "text"),
                nbt.WriteString("text", `Exited NPC Creation Mode`),
            ]), true)
        }
    } else if (socket.playerInventory.selected_inventory == "createPlayerAuto") {
        if (socket.playerInventory.selected_slot_create_player_auto == 39) {
            if (socket.createPlayerAutoSettings.state > 0) {
                packetWriter.play.remove_entities.buffer(socket, socket.createPlayerAutoSettings.marker_entities)

                socket.createPlayerAutoSettings.play_time = -61
                socket.createPlayerAutoSettings.state = 0
                socket.createPlayerAutoSettings.raw_frames = []
                socket.createPlayerAutoSettings.marker_entities = []

                packetWriter.play.set_held_slot.buffer(socket, 0)
                packetWriter.play.set_player_inventory.buffer(socket, 0, 1, "minecraft:honeycomb")
                packetWriter.play.set_player_inventory.buffer(socket, 1, 1, "minecraft:stick")
                packetWriter.play.set_player_inventory.buffer(socket, 2, 0, null)
                packetWriter.play.set_player_inventory.buffer(socket, 3, 0, "minecraft:redstone")
                packetWriter.play.set_player_inventory.buffer(socket, 4, 1, "minecraft:tnt")
                packetWriter.play.set_player_inventory.buffer(socket, 5, 0, null)
                packetWriter.play.set_player_inventory.buffer(socket, 6, 0, null)
                packetWriter.play.set_player_inventory.buffer(socket, 7, 1, "minecraft:name_tag")
                packetWriter.play.set_player_inventory.buffer(socket, 8, 0, "minecraft:emerald")

                packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                    nbt.WriteString("text", `Reset Frames`),
                ]), true)
            }
        }
        else if (socket.playerInventory.selected_slot_create_player_auto == 40) {
            socket.playerInventory.selected_inventory = "main"
            packetWriter.play.remove_entities.buffer(socket, socket.createPlayerAutoSettings.marker_entities)
            packetWriter.play.set_held_slot.buffer(socket, socket.playerInventory.selected_slot - 36)
            for (var i = 36; i < 45; i++) {
                packetWriter.play.set_player_inventory.buffer(socket, i - 36, socket.playerInventory.slot_counts[i], socket.playerInventory.slots[i])
            }

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("text", `Exited Auto NPC Creation Mode`),
            ]), true)
        }
    }
}
module.exports = {read}