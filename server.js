const net = require('net')
const fs = require('fs')
const reader = require('./data_handlers/data_reader.js')
const writer = require('./data_handlers/data_writer.js')
const registry_reader = require('./data_handlers/registry_reader.js')
const packetReader = require('./data_handlers/packet_reader/class.js')
const debug = require('./debug/debug.js')
const { Socket } = require('./data_structures.js')

var socketIndex = 0

setupLogs()
async function setupLogs() {
    if (fs.existsSync("./logs")) await fs.rmSync("./logs", {recursive: true}, () => {})
    await fs.mkdir("./logs", () => {})
}

registry_reader.readRegistries()

const server = net.createServer((socket) => {
    socket.state = "handshaking"
    socket.tick = 0n
    socket.logText = ""
    socket.index = socketIndex
    socketIndex++
    socket.log = (message, consoleLog) => {
        socket.logText += message + "\n"
        if (consoleLog != false) console.log("SOCKET " + message)
    }
    socket.writePacket = (id, identifier, data, logBytes, consoleLog) => {
        var packet = writer.CreatePacket(id, data)
        if (consoleLog != false) socket.log(`OUTGOING ${identifier} / ${id} packet (${packet.length} bytes)`)
        if (logBytes) socket.log(debug.DebugByteArrayNumbers(packet))
        socket.write(packet, consoleLog)
    }
    socket.writeEmptyPacket = (id, identifier, logBytes, consoleLog) => {
        var packet = writer.CreateEmptyPacket(id)
        if (consoleLog != false) socket.log(`OUTGOING ${identifier} / ${id} packet (${packet.length} bytes)`)
        if (logBytes) socket.log(debug.DebugByteArrayNumbers(packet))
        socket.write(packet, consoleLog)
    }
    socket.bufferPacket = (id, identifier, data, logBytes, consoleLog) => {
        socket.bufferedPackets.push({empty: false, id: id, identifier: identifier, data: data, logBytes: logBytes, consoleLog: consoleLog})
    }
    socket.bufferEmptyPacket = (id, identifier, logBytes, consoleLog) => {
        socket.bufferedPackets.push({empty: true, id: id, identifier: identifier, logBytes: logBytes, consoleLog: consoleLog})
    }
    socket.writeBufferedPackets = () => {
        for (var i = 0; i < socket.bufferedPackets.length; i++) {
            if (socket.bufferedPackets[i].empty) socket.writeEmptyPacket(socket.bufferedPackets[i].id, socket.bufferedPackets[i].identifier, socket.bufferedPackets[i].logBytes, socket.bufferedPackets[i].consoleLog)
            else socket.writePacket(socket.bufferedPackets[i].id, socket.bufferedPackets[i].identifier, socket.bufferedPackets[i].data, socket.bufferedPackets[i].logBytes, socket.bufferedPackets[i].consoleLog)
        }
        socket.bufferedPackets = []
    }
    socket.setState = (state) => {
        socket.log("Set STATE to " + state)
        socket.state = state
    }
    socket.playerPos = {
        x: 0,
        y: 0,
        z: 0,
        pitch: 0,
        yaw: 0,
        on_ground: false,
        against_wall: false,
        is_flying: false
    }
    socket.playerInventory = {
        slots: [],
        slot_counts: [],
        selected_slot: 36,
        selected_inventory: "main",
        selected_slot_player_creation: 36
    }
    socket.bufferedPackets = []
    socket.loadAll = {
        enabled: false,
        loadSize: 11,
        chunkZ: -1
    }
    socket.loadedChunks = []
    socket.markLoadedChunk = (x, z) => {
        if (socket.loadedChunks[z] == undefined) socket.loadedChunks[z] = []
        socket.loadedChunks[z][x] = true
    }
    socket.getChunkLoaded = (x, z) => {
        if (socket.loadedChunks[z] == undefined) return false
        return socket.loadedChunks[z][x]
    }
    socket.waypoints = []
    socket.createPlayerSettings = {
        marker_entities: [],
        markers: [],
        name: "minecraft:zombie",
        selected_speed: 0,
        speeds: [16, 32, 64, 128, 0.25, 0.5, 1, 2, 4, 8],
        total_distance: 0
    },
    socket.npcPlayers = []

    socket.on('data', (data) => {
        ReadPacket(socket, data)
    });

    socket.on('end', () => {
        clearInterval(socket.keepAlive)
        socket.log("", false)
        socket.log("Closed Socket in state " + socket.state)
        fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
    })

    socket.on('error', (err) => {
        clearInterval(socket.keepAlive)
        socket.log("", false)
        socket.log(`Socket error: ${err.message}`);
        fs.writeFileSync(`./logs/log${socket.index.toString().padStart(5,'0')}.txt`, socket.logText)
    })

    socket.keepAlive = setInterval(() => {
        if (socket.state == 'play') socket.writePacket(0x26, "minecraft:keep_alive", writer.WriteLong(-12345))
    }, 15000)
});

server.listen(25565, () => {
    console.log('TCP server listening on port 25565');
});

server.on('error', (err) => {
  console.error(`Server error: ${err.message}`);
  throw err;
});

/** 
 * @param {Buffer} data
 * @param {Socket} socket 
 */
function ReadPacket(socket, data) {
    if (socket.state != "play") socket.log("", false)

    var packetLength = reader.ReadVarInt(data, 0)
    var fullPacketLength = packetLength.length + packetLength.value
    var packetID = reader.ReadVarInt(data, packetLength.nextPos)
    var packetData = data.subarray(packetLength.length + packetID.length, fullPacketLength)

    if (socket.state == "handshaking") {
        if (packetID.value >= packetReader.handshaking.length) socket.log(`ERR: Recieved out of bounds packet ${packetID.value} (${fullPacketLength} bytes)`)
        else if (packetReader.handshaking[packetID.value] == null) socket.log(`ERR: Recieved unhandled packet ${packetID.value} (${fullPacketLength} bytes)`)
        else packetReader.handshaking[packetID.value](packetData, fullPacketLength, socket)
    } else if (socket.state == "status") {
        if (packetID.value >= packetReader.status.length) socket.log(`ERR: Recieved out of bounds packet ${packetID.value} (${fullPacketLength} bytes)`)
        else if (packetReader.status[packetID.value] == null) socket.log(`ERR: Recieved unhandled packet ${packetID.value} (${fullPacketLength} bytes)`)
        else packetReader.status[packetID.value](packetData, fullPacketLength, socket)
    } else if (socket.state == "login") {
        if (packetID.value >= packetReader.login.length) socket.log(`ERR: Recieved out of bounds packet ${packetID.value} (${fullPacketLength} bytes)`)
        else if (packetReader.login[packetID.value] == null) socket.log(`ERR: Recieved unhandled packet ${packetID.value} (${fullPacketLength} bytes)`)
        else packetReader.login[packetID.value](packetData, fullPacketLength, socket)
    } else if (socket.state == 'configuration') {
        if (packetID.value >= packetReader.configuration.length) socket.log(`ERR: Recieved out of bounds packet ${packetID.value} (${fullPacketLength} bytes)`)
        else if (packetReader.configuration[packetID.value] == null) socket.log(`ERR: Recieved unhandled packet ${packetID.value} (${fullPacketLength} bytes)`)
        else packetReader.configuration[packetID.value](packetData, fullPacketLength, socket)
    } else if (socket.state == 'play') {
        if (packetID.value >= packetReader.play.length) socket.log(`ERR: Recieved out of bounds packet ${packetID.value} (${fullPacketLength} bytes)`)
        else if (packetReader.play[packetID.value] == null) socket.log(`ERR: Recieved unhandled packet ${packetID.value} (${fullPacketLength} bytes)`)
        else packetReader.play[packetID.value](packetData, fullPacketLength, socket)
    } else {
        socket.log(`ERR: Recieved unhandled packet ${packetID.value} (${fullPacketLength} bytes)`)
    }

    if (data.length > fullPacketLength) {
        ReadPacket(socket, data.subarray(fullPacketLength))
    }
}