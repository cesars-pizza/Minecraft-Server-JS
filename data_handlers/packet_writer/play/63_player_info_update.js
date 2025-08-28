const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/** 
 * @param {{uuid: number | bigint | string, add_player: {name: string, properties: [{name: string, value: string, signature: string | null}]} | null, initilize_chat: {cryption: {chat_session_id: number | bigint | string, key_expiration: number | bigint, public_key: number[], key_signature: number[]} | null} | null, update_game_mode: "Survival" | "Creative" | "Adventure" | "Spectator" | 0 | 1 | 2 | 3 | null, update_listed: boolean | null, update_latency: number | null, update_display_name: {name: number[] | string | null} | null, update_list_priority: number | null, update_hat: boolean | null}[]} players 
 * @param {Socket} socket
 */
function write(socket, players) {
    socket.writePacket(63, "minecraft:player_info_update", get(players))
}

/** 
 * @param {{uuid: number | bigint | string, add_player: {name: string, properties: [{name: string, value: string, signature: string | null}]} | null, initilize_chat: {cryption: {chat_session_id: number | bigint | string, key_expiration: number | bigint, public_key: number[], key_signature: number[]} | null} | null, update_game_mode: "Survival" | "Creative" | "Adventure" | "Spectator" | 0 | 1 | 2 | 3 | null, update_listed: boolean | null, update_latency: number | null, update_display_name: {name: number[] | string | null} | null, update_list_priority: number | null, update_hat: boolean | null}[]} players 
 * @param {Socket} socket
 */
function buffer(socket, players) {
    socket.bufferPacket(63, "minecraft:player_info_update", get(players))
}

function get(players) {
    var actions = 0
    for (var i = 0; i < players.length; i++) {
        if (players[i].add_player != null && players[i].add_player != undefined) actions |= 1
        if (players[i].initilize_chat != null && players[i].initilize_chat != undefined) actions |= 2
        if (players[i].update_game_mode != null && players[i].update_game_mode != undefined) actions |= 4
        if (players[i].update_listed != null && players[i].update_listed != undefined) actions |= 8
        if (players[i].update_latency != null && players[i].update_latency != undefined) actions |= 16
        if (players[i].update_display_name != null && players[i].update_display_name != undefined) actions |= 32
        if (players[i].update_list_priority != null && players[i].update_list_priority != undefined) actions |= 64
        if (players[i].update_hat != null && players[i].update_hat != undefined) actions |= 128
    }

    for (var i = 0; i < players.length; i++) {
        if ((actions & 1) != 0 && (players[i].add_player == null || players[i].add_player == undefined)) players[i].add_player = {name: "error", properties: [{name: "textures", value: ""}]}
        if ((actions & 2) != 0 && (players[i].initilize_chat == null || players[i].initilize_chat == undefined)) players[i].initilize_chat = {}
        if ((actions & 4) != 0 && (players[i].update_game_mode == null || players[i].update_game_mode == undefined)) players[i].update_game_mode = 0
        if ((actions & 8) != 0 && (players[i].update_listed == null || players[i].update_listed == undefined)) players[i].update_listed = false
        if ((actions & 16) != 0 && (players[i].update_latency == null || players[i].update_latency == undefined)) players[i].update_latency = 0
        if ((actions & 32) != 0 && (players[i].update_display_name == null || players[i].update_display_name == undefined)) players[i].update_display_name = {}
        if ((actions & 64) != 0 && (players[i].update_list_priority == null || players[i].update_list_priority == undefined)) players[i].update_list_priority = 0
        if ((actions & 128) != 0 && (players[i].update_hat == null || players[i].update_hat == undefined)) players[i].update_hat = true
    }

    var data = writer.WriteUByte(actions).concat(writer.WriteVarInt(players.length))
    for (var i = 0; i < players.length; i++) {
        data = data.concat((typeof(players[i].uuid) == 'string') ? writer.WriteUUIDv3(players[i].uuid) : writer.WriteUUID(players[i].uuid))
        if ((actions & 1) != 0) {
            data = data.concat(
                writer.WriteString(players[i].add_player.name), 
                writer.WriteVarInt(players[i].add_player.properties.length)
            )
            for (var j = 0; j < players[i].add_player.properties.length; j++) {
                data = data.concat(
                    writer.WriteString(players[i].add_player.properties[j].name),
                    writer.WriteString(players[i].add_player.properties[j].value),
                    (players[i].add_player.properties[j].signature == null || players[i].add_player.properties[j].signature == undefined) ? writer.WriteBool(false) : writer.WriteBool(true).concat(writer.WriteString(players[i].add_player.properties[j].signature))
                )
            }
        }
        if ((actions & 2) != 0) {
            if (players[i].initilize_chat.cryption == null || players[i].initilize_chat.cryption == undefined) data = data.concat(writer.WriteBool(false))
            else {
                data.concat(
                    writer.WriteBool(true),
                    (typeof(players[i].initilize_chat.cryption.chat_session_id) == 'string') ? writer.WriteUUIDv3(players[i].initilize_chat.cryption.chat_session_id) : writer.WriteUUID(players[i].initilize_chat.cryption.chat_session_id),
                    writer.WriteLong(players[i].initilize_chat.cryption.key_expiration),
                    writer.WriteVarInt(players[i].initilize_chat.cryption.public_key.length),
                    players[i].initilize_chat.cryption.public_key,
                    writer.WriteVarInt(players[i].initilize_chat.cryption.key_signature.length),
                    players[i].initilize_chat.cryption.key_signature
                )
            }
        }
        if ((actions & 4) != 0) {
            var value = players[i].update_game_mode
            if (typeof(value) == "string") {
                if (value.toLowerCase() == "survival") value = 0
                else if (value.toLowerCase() == "creative") value = 0
                else if (value.toLowerCase() == "adventure") value = 0
                else if (value.toLowerCase() == "spectator") value = 0
            }
            data = data.concat(writer.WriteVarInt(value))
        }
        if ((actions & 8) != 0) {
            data = data.concat(writer.WriteBool(players[i].update_listed))
        }
        if ((actions & 16) != 0) {
            data = data.concat(writer.WriteVarInt(players[i].update_latency))
        }
        if ((actions & 32) != 0) {
            if (players[i].update_display_name.name == null || players[i].update_display_name.name == undefined) data = data.concat(writer.WriteBool(false))
            else if (typeof(players[i].update_display_name.name) == 'string') data = data.concat(writer.WriteBool(true), writer.WriteString(players[i].update_display_name.name))
            else data = data.concat(writer.WriteBool(true), players[i].update_display_name.name)
        }
        if ((actions & 64) != 0) {
            data = data.concat(writer.WriteVarInt(players[i].update_list_priority))
        }
        if ((actions & 128) != 0) {
            data = data.concat(writer.WriteBool(players[i].update_hat))
        }
    }

    return data
}

module.exports = {write, buffer}