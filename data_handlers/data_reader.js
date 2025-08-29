function ReadVarInt(data, position) {
    var value = 0
    var innerPosition = 0
    var currentByte;

    while (true) {
        currentByte = data[position]
        position++
        value |= (currentByte & 0x7F) << innerPosition

        if ((currentByte & 0x80) == 0) break;

        innerPosition += 7

        if (innerPosition >= 32) throw Error("VarInt is too big")
    }

    return {length: (innerPosition / 7) + 1, nextPos: position, value: value}
}

function ReadString(data, position) {
    var size = ReadVarInt(data, position)

    var stringData = data.subarray(size.length + position, size.length + size.value + position)

    return {length: size.length + stringData.length, nextPos: position + size.length + stringData.length, value: stringData.toString()}
}

function ReadUShort(data, position) {
    return {length: 2, nextPos: position + 2, value: data[position] * 256 + data[position + 1]}
}

function ReadShort(data, position) {
    var value = data[position] * 256 + data[position + 1]
    if (value >= 32768) value -= 65536
    return {length: 2, nextPos: position + 2, value: value}
}

function ReadLong(data, position) {
    var unsignedValue = BigInt(data[position]) * 72057594037927936n + BigInt(data[position + 1]) * 281474976710656n + BigInt(data[position + 2]) * 1099511627776n + BigInt(data[position + 3]) * 4294967296n + BigInt(data[position + 4]) * 16777216n + BigInt(data[position + 5]) * 65536n + BigInt(data[position + 6]) * 256n + BigInt(data[position + 7])
    return {length: 8, nextPos: position + 8, value: (unsignedValue < 0x8000000000000000n) ? unsignedValue : (unsignedValue - 0x8000000000000000n)}
}

function ReadUUID(data, position) {
    var highOrder = BigInt(data[position]) * 72057594037927936n + BigInt(data[position + 1]) * 281474976710656n + BigInt(data[position + 2]) * 1099511627776n + BigInt(data[position + 3]) * 4294967296n + BigInt(data[position + 4]) * 16777216n + BigInt(data[position + 5]) * 65536n + BigInt(data[position + 6]) * 256n + BigInt(data[position + 7])
    var lowOrder = BigInt(data[position + 8]) * 72057594037927936n + BigInt(data[position + 9]) * 281474976710656n + BigInt(data[position + 10]) * 1099511627776n + BigInt(data[position + 11]) * 4294967296n + BigInt(data[position + 12]) * 16777216n + BigInt(data[position + 13]) * 65536n + BigInt(data[position + 14]) * 256n + BigInt(data[position + 15])
    return {length: 16, nextPos: position + 16, value: highOrder * 18446744073709551616n + lowOrder}
}

function ReadPrefixedByteArray(data, position) {
    var length = ReadVarInt(data, position)
    var arrayData = data.subarray(length.nextPos, length.nextPos + length.value + 1)
    return {length: length.length + length.value, nextPos: length.nextPos + length.value, value: arrayData}
}

function ReadByte(data, position) {
    value = data[position]
    if (value >= 128) value -= 256
    return {length: 1, nextPos: position + 1, value: value}
}

function ReadUByte(data, position) {
    return {length: 1, nextPos: position + 1, value: data[position]}
}

function ReadBool(data, position) {
    return {length: 1, nextPos: position + 1, value: data[position] == 1}
}

function ReadIdentifier(data, position) {
    var size = ReadVarInt(data, position)

    var stringData = data.subarray(size.length + position, size.length + size.value + position)

    return {length: size.length + stringData.length, nextPos: position + size.length + stringData.length, value: stringData.toString()}
}

function ReadFloat(data, position) {
    return {length: 4, nextPos: position + 4, value: data.readFloatBE(position)}
}

function ReadDouble(data, position) {
    return {length: 8, nextPos: position + 8, value: data.readDoubleBE(position)}
}

function ReadSlot(data, position) {
    // Need to completely implement later
    var itemCount = ReadVarInt(data, position)
    if (itemCount.value > 0) {
        var itemID = ReadVarInt(data, itemCount.nextPos)
        var addedComponentsCount = ReadVarInt(data, itemID.nextPos)
        var removedComponentsCount = ReadVarInt(data, addedComponentsCount.nextPos)
        
        var position = removedComponentsCount.nextPos
        var addedComponents = []
        for (var i = 0; i < addedComponentsCount.value; i++) {

        }

        return {length: 0, nextPos: 0, value: {count: itemCount.value, id: itemID.value, addedComponents: [], removedComponents: []}}
    } else return {length: itemCount.length, nextPos: itemCount.nextPos, value: {count: 0, id: -1, addedComponents: [], removedComponents: []}}
}

function ReadPosition(data, position) {
    var x = 0
    x += data[position] << 18
    x += data[position + 1] << 10
    x += data[position + 2] << 2
    x += (data[position + 3] & 0b11000000) >> 6
    if (x >= 33554432) x -= 67108864
    
    var z = 0
    z += (data[position + 3] & 0b00111111) << 20
    z += data[position + 4] << 12
    z += data[position + 5] << 4
    z += (data[position + 6] & 0b11110000) >> 4
    if (z >= 33554432) z -= 67108864
    
    var y = 0
    y += (data[position + 6] & 0b00001111) << 8
    y += data[position + 7]
    if (y >= 2048) y -= 4096

    return {length: 8, nextPos: position + 8, value: {x: x, y: y, z: z}}
}

module.exports = {ReadPosition, ReadSlot, ReadShort, ReadFloat, ReadDouble, ReadIdentifier, ReadVarInt, ReadString, ReadUShort, ReadLong, ReadUUID, ReadPrefixedByteArray, ReadByte, ReadUByte, ReadBool}