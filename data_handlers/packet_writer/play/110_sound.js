const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

var id = 110
var name = "minecraft:sound"

/** 
 * @param {Socket} socket  
 * @param {number | {sound: string, fixed_range: number | null}} sound 
 * @param {"master" | "music" | "record" | "weather" | "block" | "hostile" | "neutral" | "player" | "ambient" | "voice"} category 
 * @param {{x: number, y: number, z: number}} position
 * @param {number} volume 
 * @param {number} pitch 
 * @param {number | bigint} seed 
 */
function write(socket, sound, category, position, volume, pitch, seed) {
    socket.writePacket(id, name, get(sound, category, position, volume, pitch, seed))
}

/** 
 * @param {Socket} socket  
 * @param {number | {sound: string, fixed_range: number | null}} sound 
 * @param {"master" | "music" | "record" | "weather" | "block" | "hostile" | "neutral" | "player" | "ambient" | "voice"} category 
 * @param {{x: number, y: number, z: number}} position
 * @param {number} volume 
 * @param {number} pitch 
 * @param {number | bigint} seed 
 */
function buffer(socket, sound, category, position, volume, pitch, seed) {
    socket.bufferPacket(id, name, get(sound, category, position, volume, pitch, seed))
}

function get(sound, category, position, volume, pitch, seed) {
    var data = []
    if (typeof(sound) == 'number') {
        data = writer.WriteVarInt(sound + 1)
    } else {
        data = writer.WriteVarInt(0).concat(writer.WriteIdentifier(sound.sound))
        if (sound.fixed_range == null || sound.fixed_range == undefined) data = data.concat(writer.WriteBool(false))
        else data = data.concat(writer.WriteBool(true), writer.WriteFloat(sound.fixed_range))
    }

    if (category == "master") category = 0
    else if (category == "music") category = 1
    else if (category == "record") category = 2
    else if (category == "weather") category = 3
    else if (category == "block") category = 4
    else if (category == "hostile") category = 5
    else if (category == "neutral") category = 6
    else if (category == "player") category = 7
    else if (category == "ambient") category = 8
    else if (category == "voice") category = 9

    data = data.concat(
        writer.WriteVarInt(category),
        writer.WriteInt(position.x * 8),
        writer.WriteInt(position.y * 8),
        writer.WriteInt(position.z * 8),
        writer.WriteFloat(volume),
        writer.WriteFloat(pitch),
        writer.WriteLong(seed),
    )

    return data
}

module.exports = {write, buffer}