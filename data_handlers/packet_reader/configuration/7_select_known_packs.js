const { Socket } = require('../../../data_structures.js')
const registryHelper = require('../../../helpers/writeRegistryPackets.js')
const packetWriter = require('../../packet_writer/class.js')

/** @param {Socket} socket  */
function read(data, length, socket, state) {
    socket.log(`INCOMING minecraft:select_known_packs / 7 packet (${length} bytes)`)

    registryHelper.WriteAllRegistries(socket)
    packetWriter.configuration.finish_configuration.write(socket)
}
module.exports = {read}