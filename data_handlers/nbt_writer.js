/** @param {number[][]} elements */
function WriteNBT(elements) {
    var typeID = [0x0A]

    var valueBytes = typeID

    for (var i = 0; i < elements.length; i++) {
        for (var j = 0; j < elements[i].length; j++) {
            valueBytes.push(elements[i][j])
        }
    }

    valueBytes.push(0x00)

    return valueBytes
}

function WriteEnd() {
    return [0x00]
}

/** 
 * @param {number} value
 * @param {string} name */
function WriteByte(name, value) {
    if (value < 0) value += 256

    var typeID = [0x01]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))
    var valueBytes = [value]

    return typeID.concat(nameLength, nameBytes, valueBytes)
}

/** 
 * @param {number} value
 * @param {string} name */
function WriteShort(name, value) {
    if (value < 0) value += 65536

    var typeID = [0x02]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))
    var valueBytes = [(value & 0xFF00) >> 8, value & 0xFF]

    return typeID.concat(nameLength, nameBytes, valueBytes)
}

/** 
 * @param {number} value
 * @param {string} name */
function WriteInt(name, value) {
    if (value < 0) value += 4294967296

    var typeID = [0x03]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))
    var valueBytes = [(value & 0xFF000000) >> 24, (value & 0xFF0000) >> 16, (value & 0xFF00) >> 8, value & 0xFF]

    return typeID.concat(nameLength, nameBytes, valueBytes)
}

/** 
 * @param {number} value
 * @param {string} name */
function WriteLong(name, value) {
    if (value < 0) value += 18446744073709551616

    var typeID = [0x04]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))
    var valueBytes = [(value & 0xFF00000000000000) >> 56, (value & 0xFF000000000000) >> 48, (value & 0xFF0000000000) >> 40, (value & 0xFF00000000) >> 32, (value & 0xFF000000) >> 24, (value & 0xFF0000) >> 16, (value & 0xFF00) >> 8, value & 0xFF]

    return typeID.concat(nameLength, nameBytes, valueBytes)
}

/** 
 * @param {number} value
 * @param {string} name */
function WriteFloat(name, value) {
    var typeID = [0x05]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))
    var valueBytes = Buffer.allocUnsafe(4)
    valueBytes.writeFloatBE(value, 0)

    return typeID.concat(nameLength, nameBytes, Array.from(valueBytes))
}

/** 
 * @param {number} value
 * @param {string} name */
function WriteDouble(name, value) {
    var typeID = [0x06]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))
    var valueBytes = Buffer.allocUnsafe(8)
    valueBytes.writeDoubleBE(value, 0)

    return typeID.concat(nameLength, nameBytes, Array.from(valueBytes))
}

/** 
 * @param {number[]} value
 * @param {string} name */
function WriteByteArray(name, elements) {
    var typeID = [0x07]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))

    var header = typeID.concat(nameLength, nameBytes)

    for (var i = 0; i < elements.length; i++) {
        var value = elements[i]
        if (value < 0) value += 256
        var valueBytes = [value]

        header.push(valueBytes[0])
    }

    return header
}

/** 
 * @param {string} value
 * @param {string} name */
function WriteString(name, value) {
    var typeID = [0x08]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))

    var textLength = [(value.length & 0xFF00) >> 8, value.length & 0xFF]
    var textBytes = Array.from(Buffer.from(value))

    var valueBytes = typeID.concat(nameLength, nameBytes, textLength, textBytes)

    return valueBytes
}

/** 
 * @param {number[][]} elements
 * @param {number} innerTypeID
 * @param {string} name */
function WriteList(name, innerTypeID, elements) {
    var typeID = [0x09]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))

    var innerTypeIDBytes = [innerTypeID]
    var listLength = [(elements.length & 0xFF000000) >> 24, (elements.length & 0xFF0000) >> 16, (elements.length & 0xFF00) >> 8, elements.length & 0xFF]

    var valueBytes = typeID.concat(nameLength, nameBytes, innerTypeIDBytes, listLength)

    for (var i = 0; i < elements.length; i++) {
        var elementHeaderLength = elements[i][1] * 256 + elements[i][2] + 3
        var elementPayload = elements[i].slice(elementHeaderLength)

        for (var j = 0; j < elementPayload.length; j++) {
            valueBytes.push(elementPayload[j])
        }
    }

    return valueBytes
}

/** 
 * @param {number[][]} elements
 * @param {string} name */
function WriteCompound(name, elements) {
    var typeID = [0x0A]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))

    var valueBytes = typeID.concat(nameLength, nameBytes)

    for (var i = 0; i < elements.length; i++) {
        for (var j = 0; j < elements[i].length; j++) {
            valueBytes.push(elements[i][j])
        }
    }

    valueBytes.push(0x00)

    return valueBytes
}

/** 
 * @param {number[]} elements
 * @param {string} name */
function WriteIntArray(name, elements) {
    var typeID = [0x0B]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))

    var header = typeID.concat(nameLength, nameBytes)

    for (var i = 0; i < elements.length; i++) {
        var value = elements[i]
        if (value < 0) value += 4294967296
        var valueBytes = [(value & 0xFF000000) >> 24, (value & 0xFF0000) >> 16, (value & 0xFF00) >> 8, (value & 0xFF) >> 0]

        header.push(valueBytes[0], valueBytes[1], valueBytes[2], valueBytes[3])
    }

    return header
}

/** 
 * @param {number[]} elements
 * @param {string} name */
function WriteLongArray(name, elements) {
    var typeID = [0x0C]
    var nameLength = [(name.length & 0xFF00) >> 8, name.length & 0xFF]
    var nameBytes = Array.from(Buffer.from(name))

    var header = typeID.concat(nameLength, nameBytes)

    for (var i = 0; i < elements.length; i++) {
        var value = elements[i]
        if (value < 0) value += 18446744073709551616
        var valueBytes = [(value & 0xFF00000000000000) >> 56, (value & 0xFF000000000000) >> 48, (value & 0xFF0000000000) >> 40, (value & 0xFF00000000) >> 32, (value & 0xFF000000) >> 24, (value & 0xFF0000) >> 16, (value & 0xFF00) >> 8, (value & 0xFF) >> 0]

        header.push(valueBytes[0], valueBytes[1], valueBytes[2], valueBytes[3], valueBytes[4], valueBytes[5], valueBytes[6], valueBytes[7])
    }

    return header
}

module.exports = {WriteByte, WriteByteArray, WriteCompound, WriteDouble, WriteFloat, WriteInt, WriteIntArray, WriteList, WriteLong, WriteLongArray, WriteNBT, WriteShort, WriteString}