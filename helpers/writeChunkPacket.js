const writer = require('../data_handlers/data_writer.js')
const registryReader = require('../data_handlers/registry_reader.js')

function CreatePlatformChunk(x, z, height, size, block, light_level) {
    var selectedBlockID = 0
    if (typeof block == 'string') selectedBlockID = registryReader.GetBlockID(block, {})
    else if (typeof block == 'number') selectedBlockID = block

    var blockCounts = Array(384 / 16).fill(256)

    var chunkHeightmap = Array(16).fill(Array(16).fill(height + size + 64))
    var chunkBlocks = Array(384).fill(Array(16).fill(Array(16).fill(0)))
    var chunkBiomes = Array(384 / 4).fill(Array(4).fill(Array(4).fill(0)))
    chunkBlocks.fill(Array(16).fill(Array(16).fill(selectedBlockID)), height + 64, height + size + 64)

    var lights = Array(384 + 32).fill(Array(16).fill(Array(16).fill(light_level)))

    var chunkX = writer.WriteInt(x)
    var chunkZ = writer.WriteInt(z)
    var chunkData = writer.WriteChunkData(384, chunkHeightmap, chunkHeightmap, chunkHeightmap, blockCounts, chunkBlocks, chunkBiomes)
    var lightData = writer.WriteLightData(lights, lights)

    return chunkX.concat(chunkZ, chunkData, lightData)
}

function CreateEmptyChunk(x, z) {
    var blockCounts = Array(384 / 16).fill(256)

    var chunkHeightmap = Array(16).fill(Array(16).fill(0))
    var chunkBlocks = Array(384).fill(Array(16).fill(Array(16).fill(0)))
    var chunkBiomes = Array(384 / 4).fill(Array(4).fill(Array(4).fill(0)))

    var lights = Array(384 + 32).fill(Array(16).fill(Array(16).fill(15)))

    var chunkX = writer.WriteInt(x)
    var chunkZ = writer.WriteInt(z)
    var chunkData = writer.WriteChunkData(384, chunkHeightmap, chunkHeightmap, chunkHeightmap, blockCounts, chunkBlocks, chunkBiomes)
    var lightData = writer.WriteLightData(lights, lights)

    return chunkX.concat(chunkZ, chunkData, lightData)
}

module.exports = {CreatePlatformChunk, CreateEmptyChunk}