const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const chunkPacketHelper = require('../../../helpers/writeChunkPacket.js')
const registryReader = require('../../registry_reader.js')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')

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

    
    if (socket.playerInventory.selected_inventory == "main") {
        var heldItemID = socket.playerInventory.slots[socket.playerInventory.selected_slot]
        var heldStatelessBlockID = registryReader.convertItemIDToBlockID(heldItemID)
        packetWriter.play.block_changed_ack.buffer(socket, sequence.value)
        if (!registryReader.getItemFromID(heldItemID).endsWith('concrete')) {
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
        } else packetWriter.play.block_update.buffer(socket, location.value.x, location.value.y, location.value.z, registryReader.getItemFromID(heldItemID))
    }
}
module.exports = {read}