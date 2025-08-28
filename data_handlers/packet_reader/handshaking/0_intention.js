const { Socket } = require('../../../data_structures.js')
const reader = require('../../data_reader.js')
const writer = require('../../data_writer.js')
const nbt = require('../../nbt_writer.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    var protocolVersion = reader.ReadVarInt(data, 0)
    var serverAddress = reader.ReadString(data, protocolVersion.nextPos)
    var serverPort = reader.ReadUShort(data, serverAddress.nextPos)
    var intent = reader.ReadVarInt(data, serverPort.nextPos)

    socket.inputProtocol = protocolVersion.value

    socket.log(`INCOMING minecraft:intention / 0 packet (${length} bytes)`)

    if (intent.value == 1) socket.setState('status') 
    else if (intent.value == 2 || intent.value == 3) {
        if (protocolVersion.value == 772) socket.setState('login')
        else if (protocolVersion.value < 772) {
            socket.log("Unknown Protocol Version " + protocolVersion.value)
            if (protocolVersion.value < 770) packetWriter.login.login_disconnect.write(socket, `{"text":"Outdated Client: ${protocolVersion.value} (expected 772)"}`)
            else {
                packetWriter.login.login_disconnect.write(socket, nbt.WriteNBT([
                    nbt.WriteString("type", "text"),
                    nbt.WriteString("text", `Outdated Client: ${protocolVersion.value} (expected 772)`),
                ]))
            }
        } else if (protocolVersion.value > 772) {
            socket.log("Unknown Protocol Version " + protocolVersion.value)
            if (protocolVersion.value < 770) packetWriter.login.login_disconnect.write(socket, `{"text":"Outdated Server: 772 (client on ${protocolVersion.value})"}`)
            else {
                packetWriter.login.login_disconnect.write(socket, nbt.WriteNBT([
                    nbt.WriteString("type", "text"),
                    nbt.WriteString("text", `Outdated Server: 772 (client on ${protocolVersion.value})`),
                ]))
            }
        }
    }
    else socket.log(`Unknown Intent: ${intent.value}`)
}
module.exports = {read}