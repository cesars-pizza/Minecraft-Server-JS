class Socket {
    /**
     * @param {"handshaking" | "status" | "login" | "configuration" | "play"} state 
     * @param {bigint} tick 
     * @param {string} logText 
     * @param {number} index 
     * @param {(message: string, consoleLog: boolean) => void} log 
     * @param {(id: number, identifier: string, data: number[], logBytes: boolean | null, consoleLog: boolean | null) => void} writePacket 
     * @param {(id: number, identifier: string, logBytes: boolean | null, consoleLog: boolean | null) => void} writeEmptyPacket 
     * @param {(id: number, identifier: string, data: number[], logBytes: boolean | null, consoleLog: boolean | null) => void} bufferPacket 
     * @param {(id: number, identifier: string, logBytes: boolean | null, consoleLog: boolean | null) => void} bufferEmptyPacket 
     * @param {() => void} writeBufferedPackets 
     * @param {(state: "handshaking" | "status" | "login" | "configuration" | "play") => void} setState 
     * @param {{x: number, y: number, z: number, pitch: number, yaw: number, on_ground: boolean, against_wall: boolean, is_flying: boolean}} playerPos 
     * @param {{slots: number[], slot_counts: number[], selected_slot: number, selected_inventory: "main" | "createPlayer", selected_slot_player_creation: number}} playerInventory 
     * @param {{empty: boolean, id: number, identifier: string, logBytes: boolean, consoleLog: boolean}[]} bufferedPackets 
     * @param {{enabled: boolean, loadSize: number, chunkZ: number}} loadAll 
     * @param {boolean[][]} loadedChunks 
     * @param {(x: number, z: number) => void} markLoadedChunk 
     * @param {(x: number, z: number) => boolean} getChunkLoaded 
     * @param {string[]} waypoints 
     * @param {{marker_entities: bigint[], markers: {x: number, y: number, z: number, pitch: number, yaw: number, distance: number}[], name: string, selected_speed: number, speeds: number[], total_distance: number}} createPlayerSettings 
     */
    constructor(state, tick, logText, index, log, writePacket, writeEmptyPacket, bufferPacket, bufferEmptyPacket, writeBufferedPackets, setState, playerPos, playerInventory, bufferedPackets, loadAll, loadedChunks, markLoadedChunk, getChunkLoaded, waypoints, createPlayerSettings) {
        this.state = state
        this.tick = tick
        this.logText = logText
        this.index = index
        this.log = log
        this.writePacket = writePacket
        this.writeEmptyPacket = writeEmptyPacket
        this.bufferPacket = bufferPacket
        this.bufferEmptyPacket = bufferEmptyPacket
        this.writeBufferedPackets = writeBufferedPackets
        this.setState = setState
        this.playerPos = playerPos
        this.playerInventory = playerInventory
        this.bufferedPackets = bufferedPackets
        this.loadAll = loadAll
        this.loadedChunks = loadedChunks
        this.markLoadedChunk = markLoadedChunk
        this.getChunkLoaded = getChunkLoaded
        this.waypoints = waypoints
        this.createPlayerSettings = createPlayerSettings
    }
}

module.exports = {Socket}