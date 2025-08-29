const crypto = require("crypto")
const registryReader = require("./registry_reader")

function CreatePacket(id, data, addExtra) {
    var packetIDVarInt = WriteVarInt(id)
    var packetLenVarInt = WriteVarInt(packetIDVarInt.length + data.length)

    var dataBytes = Array.from(Buffer.from(data, 'utf-8'))

    if (addExtra) return Buffer.from(new Uint8Array(packetLenVarInt.concat(packetIDVarInt, dataBytes, [0])))
    return Buffer.from(new Uint8Array(packetLenVarInt.concat(packetIDVarInt, dataBytes)))
}

function CreateEmptyPacket(id) {
    return Uint8Array.from([1, id])
}

function WriteVarInt(value) {
    var bytes = []

    if (typeof(value) == "number") {
        value = Math.round(value)
        while (true) {
            if ((value & ~0x7F) == 0) {
                bytes.push(value)
                return bytes
            }

            bytes.push((value & 0x7F) | 0x80)

            value >>>= 7
        }
    } else if (typeof(value) == "bigint") {
        while (true) {
            if ((value & ~0x7Fn) == 0n) {
                bytes.push(Number(value))
                return bytes
            }

            bytes.push(Number((value & 0x7Fn) | 0x80n))

            value >>= 7n
        }
    }
}

function WriteString(value) {
    var dataBytes = Array.from(Buffer.from(value, 'utf-8'))
    var lengthVarInt = WriteVarInt(dataBytes.length)

    return lengthVarInt.concat(dataBytes)
}

function WritePrefixedByteArray(value) {
    var lengthVarInt = WriteVarInt(value.length)
    return lengthVarInt.concat(Array.from(value))
}

function WriteBool(value) {
    return [Number(value)]
}

function WriteUUID(value) {
    value = BigInt(value)

    var bytes = []
    
    var shiftingValue = value
    for (var i = 0; i < 16; i++) {
        bytes[15 - i] = Number(shiftingValue % 256n)
        shiftingValue = (shiftingValue - (shiftingValue % 256n)) / 256n
    }

    return bytes
}

function WriteLong(value) {
    value = BigInt(value)
    if (value < 0) value += BigInt(18446744073709551616)
    var bytes = []
    bytes[0] = Number((value & BigInt(0xFF00000000000000)) /  BigInt(0x0100000000000000))
    bytes[1] = Number((value & BigInt(0x00FF000000000000)) /  BigInt(0x0001000000000000))
    bytes[2] = Number((value & BigInt(0x0000FF0000000000)) /  BigInt(0x0000010000000000))
    bytes[3] = Number((value & BigInt(0x000000FF00000000)) /  BigInt(0x0000000100000000))
    bytes[4] = Number((value & BigInt(0x00000000FF000000)) >> BigInt(24))
    bytes[5] = Number((value & BigInt(0x0000000000FF0000)) >> BigInt(16))
    bytes[6] = Number((value & BigInt(0x000000000000FF00)) >> BigInt(8))
    bytes[7] = Number((value & BigInt(0x00000000000000FF)) >> BigInt(0))

    return bytes
}

function WriteShort(value) {
    if (value < 0) value += 65536
    var bytes = []
    bytes[0] = (value & 0xFF00) >> 8
    bytes[1] = (value & 0x00FF) >> 0

    return bytes
}

function WriteInt(value) {
    if (value < 0) value += 4294967296
    var bytes = []
    bytes[0] = (value & 0xFF000000) >> 24
    bytes[1] = (value & 0x00FF0000) >> 16
    bytes[2] = (value & 0x0000FF00) >> 8
    bytes[3] = (value & 0x000000FF) >> 0

    return bytes
}

function WriteUByte(value) {
    return [value]
}

function WriteByte(value) {
    if (value < 0) value += 256
    return [value]
}

function WriteIdentifier(value) {
    if (!value.includes(":")) value = "minecraft:" + value

    var dataBytes = Array.from(Buffer.from(value, 'utf-8'))
    var dataBytesLen = dataBytes.length
    var lengthVarInt = Array.from(WriteVarInt(dataBytesLen))

    return lengthVarInt.concat(dataBytes)
}

function WritePrefixedOptional(included, value) {
    var boolIncluded = WriteBool(included)
    if (included) return boolIncluded.concat(value)
    return boolIncluded
}

function WriteFloat(value) {
    var buf = Buffer.alloc(4)
    buf.writeFloatBE(value)
    return Array.from(buf)
}

function WriteDouble(value) {
    var buf = Buffer.alloc(8)
    buf.writeDoubleBE(value)
    return Array.from(buf)
}

function Write2DDataArray(bitsPerEntry, sizeX, sizeZ, data) {
    var entriesPerLong = Math.floor(64 / bitsPerEntry)

    var entryCount = sizeX * sizeZ
    var longCount = Math.ceil(entryCount / entriesPerLong)

    var lastEntryCount = entryCount % entriesPerLong
    if (lastEntryCount == 0) lastEntryCount = entriesPerLong

    var outputLongs = []

    for (var i = 0; i < longCount; i++) {
        var thisEntries = entriesPerLong
        if (i == longCount - 1) thisEntries = lastEntryCount

        var thisValue = BigInt(0)

        for (var j = 0; j < thisEntries; j++) {
            var realj = j + (entriesPerLong * i)

            var dataX = realj % sizeZ
            var dataZ = Math.floor(realj / sizeZ)

            thisValue += BigInt(data[dataZ][dataX] * Math.pow(2, bitsPerEntry * j))
        }

        outputLongs.push(thisValue)
    }

    var output = []
    for (var i = 0; i < outputLongs.length; i++) {
        output = output.concat(WriteLong(outputLongs[i]))
    }
    return output
}

function Write3DDataArray(bitsPerEntry, sizeX, sizeY, sizeZ, data) {
    var entriesPerLong = Math.floor(64 / bitsPerEntry)

    var entryCount = sizeX * sizeY * sizeZ
    var longCount = Math.ceil(entryCount / entriesPerLong)

    var lastEntryCount = entryCount % entriesPerLong
    if (lastEntryCount == 0) lastEntryCount = entriesPerLong

    var outputLongs = []

    for (var i = 0; i < longCount; i++) {
        var thisEntries = entriesPerLong
        if (i == longCount - 1) thisEntries = lastEntryCount

        var thisValue = 0n

        for (var j = 0; j < thisEntries; j++) {
            var realj = j + (entriesPerLong * i)

            var dataX = realj % sizeZ
            var dataY = Math.floor(realj / (sizeX * sizeZ))
            var dataZ = Math.floor((realj % (sizeX * sizeZ)) / sizeZ)

            thisValue += BigInt(data[dataY][dataZ][dataX] * Math.pow(2, bitsPerEntry * j))
        }

        outputLongs.push(thisValue)
    }

    var output = []
    for (var i = 0; i < outputLongs.length; i++) {
        output = output.concat(WriteLong(outputLongs[i]))
    }
    return output
}

function WriteHeightmap(type, data, worldHeight) {
    var typeValue = WriteVarInt(type)
    
    var bitsPerDataEntry = Math.ceil(Math.log2(worldHeight + 1))
    var dataLongs = Write2DDataArray(bitsPerDataEntry, 16, 16, data)
    var longCount = WriteVarInt(dataLongs.length / 8)
    
    return typeValue.concat(longCount, dataLongs)
}

function WriteChunkSection(blockCount, blockData, biomeData) {
    var blockCountBytes = WriteShort(blockCount)

    var blocks = [0x77]
    var blockVariety = []
    for (var y = 0; y < 16; y++) {
        for (var z = 0; z < 16; z++) {
            for (var x = 0; x < 16; x++) {
                if (!blockVariety.includes(blockData[y][z][x])) blockVariety.push(blockData[y][z][x])
            }
        }
    }
    if (blockVariety.length == 1) blocks = WriteSingleValuedPalettedContainer(blockVariety[0])
    else if (blockVariety.length > 256) blocks = WriteDirectPalettedContainer(15, 16, blockData)
    else {
        var BPE = Math.max(Math.ceil(Math.log2(blockVariety.length)), 4)
        var palettedBlocks = []
        
        for (var y = 0; y < 16; y++) {
            palettedBlocks.push([])
            for (var z = 0; z < 16; z++) {
                palettedBlocks[y].push([])
                for (var x = 0; x < 16; x++) {
                    palettedBlocks[y][z][x] = blockVariety.indexOf(blockData[y][z][x])
                }
            }
        }
        blocks = WriteIndirectPalettedContainer(BPE, blockVariety, 16, palettedBlocks)
    }

    var biomes = [0x88]
    var biomeVariety = []
    for (var y = 0; y < 4; y++) {
        for (var z = 0; z < 4; z++) {
            for (var x = 0; x < 4; x++) {
                if (!biomeVariety.includes(biomeData[y][z][x])) biomeVariety.push(biomeData[y][z][x])
            }
        }
    }
    if (biomeVariety.length == 1) biomes = WriteSingleValuedPalettedContainer(biomeVariety[0])
    else if (biomeVariety.length > 8) biomes = WriteDirectPalettedContainer(6, 4, biomeData)
    else {
        var BPE = Math.ceil(Math.log2(biomeVariety.length))
        var palettedBiomes = Array(4).fill(Array(4).fill(Array(4)))
        for (var y = 0; y < 4; y++) {
            palettedBiomes.push([])
            for (var z = 0; z < 4; z++) {
                palettedBiomes[y].push([])
                for (var x = 0; x < 4; x++) {
                    palettedBiomes[y][z][x] = biomeVariety.indexOf(biomeData[y][z][x])
                }
            }
        }
        biomes = WriteIndirectPalettedContainer(BPE, biomeVariety, 4, palettedBiomes)
    }

    return blockCountBytes.concat(blocks, biomes)
}

function WriteSingleValuedPalettedContainer(entryID) {
    var bitsPerEntry = WriteUByte(0)
    var value = WriteVarInt(entryID)
    return bitsPerEntry.concat(value)
}

function WriteIndirectPalettedContainer(bitsPerEntry, paletteMap, size, data) {
    var bitsPerEntryBytes = WriteUByte(bitsPerEntry)
    var paletteMapLength = WriteVarInt(paletteMap.length)
    var paletteEntries = []
    for (var i = 0; i < paletteMap.length; i++) {
        paletteEntries.push(WriteVarInt(paletteMap[i]))
    }
    var paletteData = Write3DDataArray(bitsPerEntry, size, size, size, data)
    
    var output = bitsPerEntryBytes.concat(paletteMapLength)
    for (var i = 0; i < paletteEntries.length; i++) {
        output = output.concat(paletteEntries[i])
    }

    return output.concat(paletteData)
}

function WriteDirectPalettedContainer(bitsPerEntry, size, data) {
    var bitsPerEntryBytes = WriteUByte(bitsPerEntry)
    var paletteData = Write3DDataArray(bitsPerEntry, size, size, size, data)
    
    return bitsPerEntryBytes.concat(paletteData)
}

function WriteChunkData(worldHeight, surfaceHeightmap, motionBlockingHeightmap, motionBlockingNonLeavesHeightmap, blockCounts, blocks, biomes) {
    // Need to Implement Block Entities
    // Need to auto-calculate heightmaps & block count
    
    var surfaceHeightmapData = WriteHeightmap(0x01, surfaceHeightmap, worldHeight)
    var motionBlockingHeightmapData = WriteHeightmap(0x04, motionBlockingHeightmap, worldHeight)
    var motionBlockingNonLeavesHeightmapData = WriteHeightmap(0x05, motionBlockingNonLeavesHeightmap, worldHeight)
    var heightmapsFull = WriteVarInt(3).concat(surfaceHeightmapData, motionBlockingHeightmapData, motionBlockingNonLeavesHeightmapData)

    var chunkDataLen = 0
    var chunkSections = []
    for (var i = 0; i < worldHeight / 16; i++) {
        var thisChunkSection = WriteChunkSection(blockCounts[i], blocks.slice(i * 16, (i * 16) + 16), biomes.slice(i * 4, (i * 4) + 4))
        chunkDataLen += thisChunkSection.length
        chunkSections.push(thisChunkSection)
    }

    var chunkDataLenBytes = WriteVarInt(chunkDataLen)
    var chunkDataBytes = []
    for (var i = 0; i < chunkSections.length; i++) {
        chunkDataBytes = chunkDataBytes.concat(chunkSections[i])
    }

    var blockEntityCount = WriteVarInt(0)

    return heightmapsFull.concat(chunkDataLenBytes, chunkDataBytes, blockEntityCount)
}

function WriteBlockEntity(relPosX, posY, relPosZ, id, nbt) {
    var xz = WritePackedCoords(relPosX, relPosZ)
    var y = WriteShort(posY)
    var type = WriteVarInt(id)
    
    return xy.concat(y, type, nbt)
}

function WritePackedCoords(x, z) {
    // Need to Actually Implement

    return WriteUByte(0)
}

function WriteBitSet(data) {
    var longs = []
    for (var i = 0; i < 64 * Math.ceil((data.length) / 64); i++) {
        if ((i % 64) == 0) longs[Math.floor(i / 64)] = 0n

        var selectedData = false
        if (63 - i < data.length) selectedData = data[63 - i]

        longs[Math.floor(i / 64)] *= 2n
        longs[Math.floor(i / 64)] += BigInt(selectedData)
    }
    var output = WriteVarInt(longs.length)
    for (var i = 0; i < longs.length; i++) {
        output = output.concat(WriteLong(longs[i]))
    }
    return output
}

function WriteLightData(skylight, blocklight) {
    var skyMask = WriteBitSet(Array(skylight.length / 16).fill(true))
    var blockMask = WriteBitSet(Array(blocklight.length / 16).fill(true))

    var skyEmptyMask = []
    var blockEmptyMask = []

    var skySections = []
    var blockSections = []

    for (var section = 0; section < skylight.length / 16; section++) {
        var skyIsEmpty = true
        var blockIsEmpty = true

        var skySectionArray = []
        var blockSectionArray = []

        for (var y = 0; y < 16; y++) {
            for (var z = 0; z < 16; z++) {
                for (var x = 0; x < 16; x++) {
                    if ((x % 2) == 0) {
                        skySectionArray[(y * 128) + (z * 8) + (Math.floor(x / 2))] = skylight[(section * 16) + y][z][x]
                        blockSectionArray[(y * 128) + (z * 8) + (Math.floor(x / 2))] = blocklight[(section * 16) + y][z][x]
                    } else {
                        skySectionArray[(y * 128) + (z * 8) + (Math.floor(x / 2))] += skylight[(section * 16) + y][z][x] * 16
                        blockSectionArray[(y * 128) + (z * 8) + (Math.floor(x / 2))] += blocklight[(section * 16) + y][z][x] * 16
                    }

                    if (skylight[(section * 16) + y][z][x] != 0) skyIsEmpty = false
                    if (blocklight[(section * 16) + y][z][x] != 0) blockIsEmpty = false
                }
            }
        }

        skyEmptyMask.push(skyIsEmpty)
        skySections.push(skySectionArray)
        //if (!skyIsEmpty) skySections.push(skySectionArray)
        blockEmptyMask.push(blockIsEmpty)
        blockSections.push(blockSectionArray)
        //if (!blockIsEmpty) blockSections.push(blockSectionArray)
    }

    skyEmptyMask = WriteBitSet(skyEmptyMask)
    blockEmptyMask = WriteBitSet(blockEmptyMask)

    //skyMask = skyEmptyMask
    //blockMask = blockEmptyMask

    var lightSectionCount = WriteVarInt(skySections.length)
    var lightSectionLength = WriteVarInt(2048)

    var output = skyMask.concat(blockMask, skyEmptyMask, blockEmptyMask, lightSectionCount)
    for (var i = 0; i < skySections.length; i++) {
        output = output.concat(lightSectionLength, skySections[i])
    }
    output = output.concat(lightSectionCount)
    for (var i = 0; i < blockSections.length; i++) {
        output = output.concat(lightSectionLength, blockSections[i])
    }

    return output
}

function WritePosition(x, y, z) {
    var bytes = [0, 0, 0, 0, 0, 0, 0, 0]

    if (x < 0) x += 67108864
    if (y < 0) y += 4096
    if (z < 0) z += 67108864

    bytes[0] =  (x & 0b11111111000000000000000000) >> 18
    bytes[1] =  (x & 0b00000000111111110000000000) >> 10
    bytes[2] =  (x & 0b00000000000000001111111100) >> 2
    bytes[3] = ((x & 0b00000000000000000000000011) << 6) + ((z & 0b11111100000000000000000000) >> 20)
    bytes[4] =  (z & 0b00000011111111000000000000) >> 12
    bytes[5] =  (z & 0b00000000000000111111110000) >> 4
    bytes[6] = ((z & 0b00000000000000000000001111) << 4) + ((y & 0b111100000000) >> 8)
    bytes[7] =   y & 0b000011111111

    return bytes
}

function WriteSlot(itemCount, itemID) {
    var itemCountBytes = WriteVarInt(itemCount)
    if (itemCount > 0) {
        if (typeof(itemID) == 'string') itemID = registryReader.getItemID(itemID)
        return itemCountBytes.concat(WriteVarInt(itemID), WriteVarInt(0), WriteVarInt(0))
    }
    return itemCountBytes
}

function WriteAngle(angle) {
    if (angle == NaN || angle == undefined || !isFinite(angle)) angle = 0

    while (angle >= 360) angle -= 360
    while (angle < 0) angle += 360
    return [Math.floor(angle * 256 / 360)]
}

function WriteUUIDv3(name) {
    var md5hash = crypto.createHash("md5").update(name).digest("hex")
    var bytes = []
    for (var i = 0; i < 16; i++) {
        bytes[i] = Number("0x" + md5hash.substring(i * 2, i * 2 + 2))
    }
    bytes[6] &= 0x0f
    bytes[6] |= 0x30
    bytes[8] &= 0x3f
    bytes[8] |= 0x80
    return bytes
}

function WriteTeleportFlags(relativeX, relativeY, relativeZ, relativePitch, relativeYaw, relativeVelocityX, relativeVelocityY, relativeVelocityZ, rotateVelocity) {
    var value0 = 0
    var value1 = 0

    value0 |= 1 * relativeX
    value0 |= 2 * relativeY
    value0 |= 4 * relativeZ
    value0 |= 8 * relativeYaw
    value0 |= 16 * relativePitch
    value0 |= 32 * relativeVelocityX
    value0 |= 64 * relativeVelocityY
    value0 |= 128 * relativeVelocityZ

    value1 |= 1 * rotateVelocity

    return [0, 0, value1, value0]
}

module.exports = {WriteTeleportFlags, WriteUUIDv3, WriteShort, WriteAngle, WriteSlot, WritePosition, WriteLightData, WriteBlockEntity, WritePackedCoords, WriteChunkSection, WriteDirectPalettedContainer, WriteIndirectPalettedContainer, WriteSingleValuedPalettedContainer, WriteChunkData, WriteHeightmap, Write2DDataArray, Write3DDataArray, CreatePacket, WriteVarInt, WriteString, CreateEmptyPacket, WritePrefixedByteArray, WriteBool, WriteUUID, WriteLong, WriteInt, WriteByte, WriteUByte, WriteIdentifier, WritePrefixedOptional, WriteFloat, WriteDouble}