const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const nbt = require('../../nbt_writer.js')
const registryReader = require('../../registry_reader.js')
const packetWriter = require('../../packet_writer/class.js')
const { Socket } = require('../../../data_structures.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:swing / 60 packet (${length} bytes)`)

    var hand = reader.ReadVarInt(data, 0)

    if (socket.playerInventory.selected_inventory == "main") {
        var heldItem = registryReader.getItemFromID(socket.playerInventory.slots[socket.playerInventory.selected_slot])
        if (heldItem == "minecraft:diamond") {
            socket.playerInventory.selected_inventory = "createPlayer"
            socket.playerInventory.selected_slot_create_player = 36
            socket.createPlayerSettings = {
                marker_entities: [],
                markers: [],
                name: "minecraft:zombie",
                selected_speed: 0,
                speeds: [16, 32, 64, 128, 0.25, 0.5, 1, 2, 4, 8],
                total_distance: 0
            }

            packetWriter.play.set_held_slot.buffer(socket, 0)
            packetWriter.play.set_player_inventory.buffer(socket, 0, 1, "minecraft:stick")
            packetWriter.play.set_player_inventory.buffer(socket, 1, 0, null)
            packetWriter.play.set_player_inventory.buffer(socket, 2, 1, "minecraft:flint_and_steel")
            packetWriter.play.set_player_inventory.buffer(socket, 3, 1, "minecraft:lava_bucket")
            packetWriter.play.set_player_inventory.buffer(socket, 4, 1, "minecraft:tnt")
            packetWriter.play.set_player_inventory.buffer(socket, 5, 0, null)
            packetWriter.play.set_player_inventory.buffer(socket, 6, 1, "minecraft:clock")
            packetWriter.play.set_player_inventory.buffer(socket, 7, 1, "minecraft:name_tag")
            packetWriter.play.set_player_inventory.buffer(socket, 8, 1, "minecraft:diamond")

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("type", "text"),
                nbt.WriteString("text", `Started player creation`),
            ]), true)
        }
    } else if (socket.playerInventory.selected_inventory == "createPlayer") {
        if (socket.playerInventory.selected_slot_create_player == 36) {
            var thisDistance = 0
            if (socket.createPlayerSettings.markers.length > 0) {
                var thisDistanceX = Math.pow(socket.playerPos.x - socket.createPlayerSettings.markers[socket.createPlayerSettings.markers.length - 1].x, 2)
                var thisDistanceY = Math.pow(socket.playerPos.y - socket.createPlayerSettings.markers[socket.createPlayerSettings.markers.length - 1].y, 2)
                var thisDistanceZ = Math.pow(socket.playerPos.z - socket.createPlayerSettings.markers[socket.createPlayerSettings.markers.length - 1].z, 2)
                thisDistance = Math.sqrt(thisDistanceX + thisDistanceY + thisDistanceZ)
            }
            socket.createPlayerSettings.total_distance += thisDistance

            socket.createPlayerSettings.marker_entities.push(socket.tick)
            socket.createPlayerSettings.markers.push({
                x: socket.playerPos.x,
                y: socket.playerPos.y,
                z: socket.playerPos.z,
                pitch: socket.playerPos.pitch,
                yaw: socket.playerPos.yaw,
                distance: socket.createPlayerSettings.total_distance
            })

            packetWriter.play.add_entity.buffer(socket, socket.tick, socket.tick, 5, socket.playerPos.x, socket.playerPos.y, socket.playerPos.z, socket.playerPos.pitch, socket.playerPos.yaw, socket.playerPos.yaw, 0, 0, 0, 0)

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("type", "text"),
                nbt.WriteString("text", `Created marker ${socket.createPlayerSettings.markers.length - 1}`),
            ]), true)
        }
        else if (socket.playerInventory.selected_slot_create_player == 37) return
        else if (socket.playerInventory.selected_slot_create_player == 38) {
            socket.createPlayerSettings.markers.pop()
            var entityID = socket.createPlayerSettings.marker_entities.pop()
            if (entityID != undefined) {
                packetWriter.play.remove_entities.buffer(socket, [entityID])
                if (socket.createPlayerSettings.markers.length > 0) socket.createPlayerSettings.total_distance = socket.createPlayerSettings.markers[socket.createPlayerSettings.markers.length - 1].distance
                else socket.createPlayerSettings.total_distance = 0
            }

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("type", "text"),
                nbt.WriteString("text", `Removed last marker`),
            ]), true)
        }
        else if (socket.playerInventory.selected_slot_create_player == 39) {
            packetWriter.play.remove_entities.buffer(socket, socket.createPlayerSettings.marker_entities)

            socket.createPlayerSettings.marker_entities = []
            socket.createPlayerSettings.markers = []
            socket.createPlayerSettings.total_distance = 0

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("type", "text"),
                nbt.WriteString("text", `Removed all markers`),
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
                nbt.WriteString("text", `Cancelled player creation`),
            ]), true)
        }
        else if (socket.playerInventory.selected_slot_create_player == 41) return
        else if (socket.playerInventory.selected_slot_create_player == 42) {
            socket.createPlayerSettings.selected_speed++
            if (socket.createPlayerSettings.selected_speed == socket.createPlayerSettings.speeds.length) socket.createPlayerSettings.selected_speed = 0

            packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                nbt.WriteString("type", "text"),
                nbt.WriteString("text", `Set speed to ${socket.createPlayerSettings.speeds[socket.createPlayerSettings.selected_speed]} blocks/sec`),
            ]), true)
        }
        else if (socket.playerInventory.selected_slot_create_player == 43) {
            packetWriter.play.block_update.buffer(socket, socket.playerPos.x, socket.playerPos.y, socket.playerPos.z, "minecraft:oak_sign")
            packetWriter.play.open_sign_editor.buffer(socket, socket.playerPos.x, socket.playerPos.y, socket.playerPos.z, true)
        }
        else if (socket.playerInventory.selected_slot_create_player == 44) {
            if (socket.createPlayerSettings.markers.length >= 1) {
                var finalDistanceX = Math.pow(socket.createPlayerSettings.markers[0].x - socket.createPlayerSettings.markers[socket.createPlayerSettings.markers.length - 1].x, 2)
                var finalDistanceY = Math.pow(socket.createPlayerSettings.markers[0].y - socket.createPlayerSettings.markers[socket.createPlayerSettings.markers.length - 1].y, 2)
                var finalDistanceZ = Math.pow(socket.createPlayerSettings.markers[0].z - socket.createPlayerSettings.markers[socket.createPlayerSettings.markers.length - 1].z, 2)
                var finalActualDistance = Math.sqrt(finalDistanceX + finalDistanceY + finalDistanceZ)
                socket.createPlayerSettings.total_distance += finalActualDistance

                if (socket.createPlayerSettings.total_distance == 0 || socket.createPlayerSettings.markers.length == 1) {
                    socket.createPlayerSettings.markers.length = 2
                    socket.createPlayerSettings.markers[1] = {
                        x: socket.createPlayerSettings.markers[0].x,
                        y: socket.createPlayerSettings.markers[0].y + 0.010,
                        z: socket.createPlayerSettings.markers[0].z,
                        pitch: socket.createPlayerSettings.markers[0].pitch,
                        yaw: socket.createPlayerSettings.markers[0].yaw,
                        distance: 0.01
                    }
                    socket.createPlayerSettings.total_distance = 0.020
                }

                var traveledDistance = 0
                var passedMarkers = 0
                var rawFrames = []
                while (traveledDistance < socket.createPlayerSettings.total_distance) {
                    var selectedMarker = 0
                    for (var i = passedMarkers + 1; i < socket.createPlayerSettings.markers.length; i++) {
                        if (traveledDistance > socket.createPlayerSettings.markers[i].distance) {
                            selectedMarker = i
                            if (i > passedMarkers + 1) {
                                passedMarkers = i - 1
                            }
                        }
                    }
                    var nextMarker = selectedMarker + 1
                    var nextMarkerDistance = 0
                    if (nextMarker == socket.createPlayerSettings.markers.length) {
                        nextMarker = 0
                        nextMarkerDistance = socket.createPlayerSettings.total_distance
                    } else nextMarkerDistance = socket.createPlayerSettings.markers[nextMarker].distance

                    var interpolationEnd = (traveledDistance - socket.createPlayerSettings.markers[selectedMarker].distance) / (nextMarkerDistance - socket.createPlayerSettings.markers[selectedMarker].distance)
                    var interpolationStart = 1 - interpolationEnd

                    var posX = interpolationStart * socket.createPlayerSettings.markers[selectedMarker].x + interpolationEnd * socket.createPlayerSettings.markers[nextMarker].x
                    var posY = interpolationStart * socket.createPlayerSettings.markers[selectedMarker].y + interpolationEnd * socket.createPlayerSettings.markers[nextMarker].y
                    var posZ = interpolationStart * socket.createPlayerSettings.markers[selectedMarker].z + interpolationEnd * socket.createPlayerSettings.markers[nextMarker].z
                    var pitch = interpolationStart * socket.createPlayerSettings.markers[selectedMarker].pitch + interpolationEnd * socket.createPlayerSettings.markers[nextMarker].pitch
                    var yaw = interpolationStart * socket.createPlayerSettings.markers[selectedMarker].yaw + interpolationEnd * socket.createPlayerSettings.markers[nextMarker].yaw

                    traveledDistance += socket.createPlayerSettings.speeds[socket.createPlayerSettings.selected_speed] / 20

                    rawFrames.push({x: posX, y: posY, z: posZ, pitch: pitch, yaw: yaw})
                }

                var frames = []
                for (var i = 0; i < rawFrames.length; i++) {
                    var prevRawFrame = i - 1
                    if (prevRawFrame == -1) prevRawFrame = rawFrames.length - 1
                    prevRawFrame = rawFrames[prevRawFrame]

                    var changedX = rawFrames[i].x != prevRawFrame.x
                    var changedY = rawFrames[i].y != prevRawFrame.y
                    var changedZ = rawFrames[i].z != prevRawFrame.z
                    var changedPitch = rawFrames[i].pitch != prevRawFrame.pitch
                    var changedYaw = rawFrames[i].yaw != prevRawFrame.yaw

                    var changedPos = changedX || changedY || changedZ
                    var changedRot = changedPitch || changedYaw

                    var thisFrame = {
                        changedPos: changedPos,
                        changedRot: changedRot
                    }
                    if (changedPos) {
                        thisFrame.x = Math.round(rawFrames[i].x * 4096 - prevRawFrame.x * 4096)
                        thisFrame.y = Math.round(rawFrames[i].y * 4096 - prevRawFrame.y * 4096)
                        thisFrame.z = Math.round(rawFrames[i].z * 4096 - prevRawFrame.z * 4096)
                    }
                    if (changedRot) {
                        thisFrame.pitch = rawFrames[i].pitch
                        thisFrame.yaw = rawFrames[i].yaw
                    }

                    frames.push(thisFrame)
                }
                frames[0] = rawFrames[0]

                socket.npcPlayers.push({
                    frames: frames,
                    name: socket.createPlayerSettings.name,
                    id: socket.tick,
                    copies: [0]
                })

                socket.playerInventory.selected_inventory = "main"
                packetWriter.play.remove_entities.buffer(socket, socket.createPlayerSettings.marker_entities)
                packetWriter.play.set_held_slot.buffer(socket, socket.playerInventory.selected_slot - 36)
                for (var i = 36; i < 45; i++) {
                    packetWriter.play.set_player_inventory.buffer(socket, i - 36, socket.playerInventory.slot_counts[i], socket.playerInventory.slots[i])
                }

                packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                    nbt.WriteString("type", "text"),
                    nbt.WriteString("text", `Created player ${socket.createPlayerSettings.name} with ${frames.length} frames`),
                ]), true)

                var selectedEntity = registryReader.getEntityTypeID(socket.createPlayerSettings.name)
                if (selectedEntity == undefined || selectedEntity == 149) {
                    packetWriter.play.player_info_update.buffer(socket, [{uuid: `OfflinePlayer:${socket.createPlayerSettings.name}`, add_player: {name: socket.createPlayerSettings.name, properties: [{name: "texture", value: "", signature: null}]}}])

                    packetWriter.play.add_entity.buffer(socket, socket.tick, `OfflinePlayer:${socket.createPlayerSettings.name}`, 149, rawFrames[0].x, rawFrames[0].y, rawFrames[0].z, rawFrames[0].pitch, rawFrames[0].yaw, rawFrames[0].yaw, 0, 0, 0, 0)
                } else {
                    packetWriter.play.add_entity.buffer(socket, socket.tick, socket.tick, selectedEntity, rawFrames[0].x, rawFrames[0].y, rawFrames[0].z, rawFrames[0].pitch, rawFrames[0].yaw, rawFrames[0].yaw, 0, 0, 0, 0)
                }
            } else {
                packetWriter.play.system_chat.buffer(socket, nbt.WriteNBT([
                    nbt.WriteString("type", "text"),
                    nbt.WriteString("text", `Not enough markers`),
                ]), true)
            }
        }
    }
}
module.exports = {read}