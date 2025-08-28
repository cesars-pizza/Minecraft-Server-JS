const fs = require('fs')

var miscRegistries = null

// Blocks Registry
var defaultBlockStates = {}
var blockStateIDs = {}
var blockStateIDMax = 0

// Blocks Registry
var statelessBlockIDs = {}

// Items Registry
var itemIDs = {}

// Entity Types Registry
var entityTypeIDs = {}

async function readRegistries() {
    miscRegistries = await JSON.parse(fs.readFileSync("./data/data/reports/registries.json"))
    await setupBlockStateRegistry()
    await setupStatelessBlockRegistry()
    await setupItemRegistry()
    await setupEntityTypeRegistry()
}

async function setupBlockStateRegistry() {
    var blocksRegistry = JSON.parse(fs.readFileSync("./data/data/reports/blocks.json"))
    var blocks = Object.keys(blocksRegistry)
    for (var i = 0; i < blocks.length; i++) {
        var blockName = blocks[i]
        var thisDefaultState = {id: 0}
        var thisStates = []
        for (var j = 0; j < blocksRegistry[blockName].states.length; j++) {
            if (blocksRegistry[blockName].states[j].id > blockStateIDMax) blockStateIDMax = blocksRegistry[blockName].states[j].id

            var thisState = blocksRegistry[blockName].states[j].properties
            if (thisState === undefined) thisState = {}
            thisState.id = blocksRegistry[blockName].states[j].id
            thisStates.push(thisState)
            
            if (blocksRegistry[blockName].states[j].default == true) {
                thisDefaultState = blocksRegistry[blockName].states[j].properties
                if (thisDefaultState === undefined) thisDefaultState = {}
                thisDefaultState.id = blocksRegistry[blockName].states[j].id
            }
        }
        if (thisDefaultState === undefined) thisDefaultState = {}

        defaultBlockStates[blockName] = thisDefaultState
        blockStateIDs[blockName] = thisStates
    }
    console.log(`Parsed Block States Registry (${blockStateIDMax + 1} items)`)
}

function getBlockStateIDMax() {
    return blockStateIDMax
}

function getBlockID(block, states) {
    var blockSelectedState = defaultBlockStates[block]
    var blockAllProperties = Object.keys(blockSelectedState)

    var stateKeys = Object.keys(states)

    for (var i = 0; i < stateKeys.length; i++) {
        if (blockSelectedState[stateKeys[i]] !== undefined && stateKeys[i] != 'id') {
            blockSelectedState[stateKeys[i]] = states[stateKeys[i]]
        }
    }

    var blockAllStates = blockStateIDs[block]
    for (var i = 0; i < blockAllStates.length; i++) {
        var match = true

        for (var j = 0; j < blockAllProperties.length; j++) {
            if (blockAllProperties[j] != 'id' && blockSelectedState[blockAllProperties[j]] != blockAllStates[i][blockAllProperties[j]]) match = false
        }

        if (match) return blockAllStates[i].id
    }

    return 0
}

function getBlockFromID(id) {
    var block = "minecraft:air"
    var allBlocks = Object.keys(defaultBlockStates)
    for (var i = 0; i < allBlocks.length; i++) {
        if (id > defaultBlockStates[allBlocks[i]].id) block = allBlocks[i]
        else if (id == defaultBlockStates[allBlocks[i]].id) return {block: allBlocks[i], states: defaultBlockStates[allBlocks[i]]}
    }

    for (var i = 0; i < blockStateIDs[block].length; i++) {
        if (blockStateIDs[block][i].id == id) return {block: block, states: blockStateIDs[block][i]}
    }

    return {block: block, states: {}}
}

async function setupStatelessBlockRegistry() {
    var blocks = Object.keys(miscRegistries["minecraft:block"].entries)
    for (var i = 0; i < blocks.length; i++) {
        statelessBlockIDs[blocks[i]] = miscRegistries["minecraft:block"].entries[blocks[i]]["protocol_id"]
    }
    console.log(`Parsed Blocks Registry (${blocks.length} items)`)
}

function getStatelessBlockID(block) {
    return statelessBlockIDs[block]
}

function getStatelessBlockFromID(id) {
    var keys = Object.keys(statelessBlockIDs)
    for (var i = 0; i < keys.length; i++) {
        if (statelessBlockIDs[keys[i]] == id) return keys[i]
    }
    return "minecraft:air"
}

async function setupItemRegistry() {
    var items = Object.keys(miscRegistries["minecraft:item"].entries)
    for (var i = 0; i < items.length; i++) {
        itemIDs[items[i]] = miscRegistries["minecraft:item"].entries[items[i]]["protocol_id"]
    }
    console.log(`Parsed Items Registry (${items.length} items)`)
}

function getItemID(item) {
    return itemIDs[item]
}

function getItemFromID(id) {
    var keys = Object.keys(itemIDs)
    for (var i = 0; i < keys.length; i++) {
        if (itemIDs[keys[i]] == id) return keys[i]
    }
    return "minecraft:air"
}

function convertItemIDToBlockID(id) {
    if (id == undefined) return undefined
    var itemName = getItemFromID(id)
    return getStatelessBlockID(itemName)
}

function convertBlockIDToItemID(id) {
    if (id == undefined) return undefined
    var itemName = getStatelessBlockFromID(id)
    return getItemID(itemName)
}

async function setupEntityTypeRegistry() {
    var entityTypes = Object.keys(miscRegistries["minecraft:entity_type"].entries)
    for (var i = 0; i < entityTypes.length; i++) {
        entityTypeIDs[entityTypes[i]] = miscRegistries["minecraft:entity_type"].entries[entityTypes[i]]["protocol_id"]
    }
    console.log(`Parsed Entity Type Registry (${entityTypes.length} items)`)
}

function getEntityTypeID(entity_type) {
    return entityTypeIDs[entity_type]
}

function getEntityTypeFromID(id) {
    var keys = Object.keys(entityTypeIDs)
    for (var i = 0; i < keys.length; i++) {
        if (entityTypeIDs[keys[i]] == id) return keys[i]
    }
}

module.exports = {getEntityTypeID, getEntityTypeFromID, convertBlockIDToItemID, convertItemIDToBlockID, getStatelessBlockFromID, getStatelessBlockID, getItemFromID, getItemID, getBlockFromID, readRegistries, getBlockStateIDMax, getBlockID}