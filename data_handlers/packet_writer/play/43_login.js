const { Socket } = require("../../../data_structures")
const writer = require("../../data_writer")

/**
 * @param {number} entityID 
 * @param {boolean} isHardcore 
 * @param {{dimensionNames: string[], currentDimensionID: number, currentDimensionName: string}} dimensions 
 * @param {number} maxPlayers 
 * @param {number} viewDistance 
 * @param {number} simulationDistance 
 * @param {boolean} reducedDebugInfo 
 * @param {boolean} enableRespawnScreen 
 * @param {boolean} doLimitedCrafting 
 * @param {number | bigint} hashedSeed 
 * @param {{current: "Survival" | "Creative" | "Adventure" | "Spectator" | 0 | 1 | 2 | 3, previous: "Survival" | "Creative" | "Adventure" | "Spectator" | 0 | 1 | 2 | 3 | -1 | null}} gamemode 
 * @param {boolean} isDebug 
 * @param {boolean} isFlat 
 * @param {{dimension: string, x: number, y: number, z: number} | null} deathLocation 
 * @param {number} portalCooldown 
 * @param {number} seaLevel 
 * @param {boolean} enforcesSecureChat 
 * @param {Socket} socket
 */
function write(socket, entityID, isHardcore, dimensions, maxPlayers, viewDistance, simulationDistance, reducedDebugInfo, enableRespawnScreen, doLimitedCrafting, hashedSeed, gamemode, isDebug, isFlat, deathLocation, portalCooldown, seaLevel, enforcesSecureChat) {
    socket.writePacket(43, "minecraft:login", get(entityID, isHardcore, dimensions, maxPlayers, viewDistance, simulationDistance, reducedDebugInfo, enableRespawnScreen, doLimitedCrafting, hashedSeed, gamemode, isDebug, isFlat, deathLocation, portalCooldown, seaLevel, enforcesSecureChat))
}

/**
 * @param {number} entityID 
 * @param {boolean} isHardcore 
 * @param {{dimensionNames: string[], currentDimensionID: number, currentDimensionName: string}} dimensions 
 * @param {number} maxPlayers 
 * @param {number} viewDistance 
 * @param {number} simulationDistance 
 * @param {boolean} reducedDebugInfo 
 * @param {boolean} enableRespawnScreen 
 * @param {boolean} doLimitedCrafting 
 * @param {number | bigint} hashedSeed 
 * @param {{current: "Survival" | "Creative" | "Adventure" | "Spectator" | 0 | 1 | 2 | 3, previous: "Survival" | "Creative" | "Adventure" | "Spectator" | 0 | 1 | 2 | 3 | -1 | null}} gamemode 
 * @param {boolean} isDebug 
 * @param {boolean} isFlat 
 * @param {{dimension: string, x: number, y: number, z: number} | null} deathLocation 
 * @param {number} portalCooldown 
 * @param {number} seaLevel 
 * @param {boolean} enforcesSecureChat 
 * @param {Socket} socket
 */
function buffer(socket, entityID, isHardcore, dimensions, maxPlayers, viewDistance, simulationDistance, reducedDebugInfo, enableRespawnScreen, doLimitedCrafting, hashedSeed, gamemode, isDebug, isFlat, deathLocation, portalCooldown, seaLevel, enforcesSecureChat) {
    socket.bufferPacket(43, "minecraft:login", get(entityID, isHardcore, dimensions, maxPlayers, viewDistance, simulationDistance, reducedDebugInfo, enableRespawnScreen, doLimitedCrafting, hashedSeed, gamemode, isDebug, isFlat, deathLocation, portalCooldown, seaLevel, enforcesSecureChat))
}

function get(entityID, isHardcore, dimensions, maxPlayers, viewDistance, simulationDistance, reducedDebugInfo, enableRespawnScreen, doLimitedCrafting, hashedSeed, gamemode, isDebug, isFlat, deathLocation, portalCooldown, seaLevel, enforcesSecureChat) {
    var data = writer.WriteInt(entityID).concat(writer.WriteBool(isHardcore), writer.WriteVarInt(dimensions.dimensionNames.length))
    for (var i = 0; i < dimensions.dimensionNames.length; i++) {
        data = data.concat(writer.WriteIdentifier(dimensions.dimensionNames[i]))
    }
    data = data.concat(
        writer.WriteVarInt(maxPlayers),
        writer.WriteVarInt(viewDistance),
        writer.WriteVarInt(simulationDistance),
        writer.WriteBool(reducedDebugInfo),
        writer.WriteBool(enableRespawnScreen),
        writer.WriteBool(doLimitedCrafting),
        writer.WriteVarInt(dimensions.currentDimensionID),
        writer.WriteIdentifier(dimensions.currentDimensionName),
        writer.WriteLong(hashedSeed)
    )

    if (typeof(gamemode.current) == 'string') {
        if (gamemode.current.toLowerCase() == 'survival') gamemode.current = 0
        else if (gamemode.current.toLowerCase() == 'creative') gamemode.current = 1
        else if (gamemode.current.toLowerCase() == 'adventure') gamemode.current = 2
        else if (gamemode.current.toLowerCase() == 'spectator') gamemode.current = 3
    }
    if (typeof(gamemode.previous) == 'string') {
        if (gamemode.previous.toLowerCase() == 'survival') gamemode.previous = 0
        else if (gamemode.previous.toLowerCase() == 'creative') gamemode.previous = 1
        else if (gamemode.previous.toLowerCase() == 'adventure') gamemode.previous = 2
        else if (gamemode.previous.toLowerCase() == 'spectator') gamemode.previous = 3
    } else if (gamemode.previous == null) gamemode.previous = -1

    data = data.concat(
        writer.WriteUByte(gamemode.current),
        writer.WriteByte(gamemode.previous),
        writer.WriteBool(isDebug),
        writer.WriteBool(isFlat)
    )

    if (deathLocation == null) data = data.concat(writer.WriteBool(false))
    else {
        data = data.concat(
            writer.WriteBool(true),
            writer.WriteIdentifier(deathLocation.dimension),
            writer.WritePosition(deathLocation.x, deathLocation.y, deathLocation.z)
        )
    }

    data = data.concat(
        writer.WriteVarInt(portalCooldown),
        writer.WriteVarInt(seaLevel),
        writer.WriteBool(enforcesSecureChat)
    )

    return data
}

module.exports = {write, buffer}