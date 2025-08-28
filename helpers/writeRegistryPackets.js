const writer = require('../data_handlers/data_writer.js')
const nbtWriter = require('../data_handlers/nbt_writer.js')
const packetWriter = require('../data_handlers/packet_writer/class.js')
const { Socket } = require('../data_structures.js')

/** @param {Socket} socket  */
function WriteAllRegistries(socket) {
    WriteCatVariantRegisty(socket)
    WriteChickenVariantRegistry(socket)
    WriteCowVariantRegistry(socket)
    WriteDamageTypeRegistry(socket)
    WriteDimensionTypeRegistry(socket)
    WriteFrogVariantRegistry(socket)
    WritePaintingVariantRegistry(socket)
    WritePigVariantRegistry(socket)
    WriteWolfSoundVariantRegistry(socket)
    WriteWolfVariantRegistry(socket)
    WriteWorldGen_BiomeRegistry(socket)
}

/** @param {Socket} socket  */
function WriteCatVariantRegisty(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:cat_variant", [{entryID: "minecraft:red", data: nbtWriter.WriteNBT([
        nbtWriter.WriteString("asset_id", "minecraft:entity/cat/red"),
        nbtWriter.WriteList("spawn_conditions", 0x0A, [
            nbtWriter.WriteCompound("", [
                nbtWriter.WriteInt("priority", 0)
            ])
        ])
    ])}])
}

/** @param {Socket} socket  */
function WriteChickenVariantRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:chicken_variant", [{entryID: "minecraft:temperate", data: nbtWriter.WriteNBT([
        nbtWriter.WriteString("asset_id", "minecraft:entity/chicken/temperate_chicken"),
        nbtWriter.WriteList("spawn_conditions", 0x0A, [
            nbtWriter.WriteCompound("", [
                nbtWriter.WriteInt("priority", 0)
            ])
        ])
    ])}])
}

/** @param {Socket} socket  */
function WriteCowVariantRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:cow_variant", [{entryID: "minecraft:temperate", data: nbtWriter.WriteNBT([
        nbtWriter.WriteString("asset_id", "minecraft:entity/cow/temperate_cow"),
        nbtWriter.WriteList("spawn_conditions", 0x0A, [
            nbtWriter.WriteCompound("", [
                nbtWriter.WriteInt("priority", 0)
            ])
        ])
    ])}])
}

/** @param {Socket} socket  */
function WriteDamageTypeRegistry(socket) {
    var damageTypeIDs = ["minecraft:arrow", "minecraft:bad_respawn_point", "minecraft:cactus", "minecraft:campfire", "minecraft:cramming", "minecraft:dragon_breath", "minecraft:drown", "minecraft:dry_out", "minecraft:ender_pearl", "minecraft:explosion", "minecraft:fall", "minecraft:falling_anvil", "minecraft:falling_block", "minecraft:falling_stalactite", "minecraft:fireball", "minecraft:fireworks", "minecraft:fly_into_wall", "minecraft:freeze", "minecraft:generic", "minecraft:generic_kill", "minecraft:hot_floor", "minecraft:indirect_magic", "minecraft:in_fire", "minecraft:in_wall", "minecraft:lava", "minecraft:lightning_bolt", "minecraft:mace_smash", "minecraft:magic", "minecraft:mob_attack", "minecraft:mob_attack_no_aggro", "minecraft:mob_projectile", "minecraft:on_fire", "minecraft:outside_border", "minecraft:out_of_world", "minecraft:player_attack", "minecraft:player_explosion", "minecraft:sonic_boom", "minecraft:spit", "minecraft:stalagmite", "minecraft:starve", "minecraft:sting", "minecraft:sweet_berry_bush", "minecraft:thorns", "minecraft:thrown", "minecraft:trident", "minecraft:unattributed_fireball", "minecraft:wind_charge", "minecraft:wither", "minecraft:wither_skull"]
    var damageTypeNBT = nbtWriter.WriteNBT([
        nbtWriter.WriteString("effects", "burning"),
        nbtWriter.WriteFloat("exhaustion", 0.1),
        nbtWriter.WriteString("message_id", "inFire"),
        nbtWriter.WriteString("scaling", "when_caused_by_living_non_player")
    ])
    var damageTypeData = []
    for (var i = 0; i < damageTypeIDs.length; i++) {
        damageTypeData.push({entryID: damageTypeIDs[i], data: damageTypeNBT})
    }

    packetWriter.configuration.registry_data.write(socket, "minecraft:damage_type", damageTypeData)
}

/** @param {Socket} socket  */
function WriteDimensionTypeRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:dimension_type", [{entryID: "minecraft:overworld", data: nbtWriter.WriteNBT([
        nbtWriter.WriteByte("has_skylight", 1),
        nbtWriter.WriteByte("has_ceiling", 0),
        nbtWriter.WriteByte("ultrawarm", 0),
        nbtWriter.WriteByte("natural", 1),
        nbtWriter.WriteDouble("coordinate_scale", 1.0),
        nbtWriter.WriteByte("bed_works", 1),
        nbtWriter.WriteByte("respawn_anchor_works", 0),
        nbtWriter.WriteInt("min_y", -64),
        nbtWriter.WriteInt("height", 384),
        nbtWriter.WriteInt("logical_height", 384),
        nbtWriter.WriteString("infiniburn", "#minecraft:infiniburn_overworld"),
        nbtWriter.WriteString("effects", "minecraft:overworld"),
        nbtWriter.WriteFloat("ambient_light", 0.0),
        nbtWriter.WriteByte("piglin_safe", 0),
        nbtWriter.WriteByte("has_raids", 1),
        nbtWriter.WriteCompound("monster_spawn_light_level", [
            nbtWriter.WriteString("type", "minecraft:uniform"),
            nbtWriter.WriteInt("max_inclusive", 7),
            nbtWriter.WriteInt("min_inclusive", 0)
        ]),
        nbtWriter.WriteInt("monster_spawn_block_light_limit", 15),
        nbtWriter.WriteInt("cloud_height", 192)
    ])}])
}

/** @param {Socket} socket  */
function WriteFrogVariantRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:frog_variant", [{entryID: "minecraft:warm", data: nbtWriter.WriteNBT([
        nbtWriter.WriteString("asset_id", "minecraft:entity/frog/warm_frog"),
        nbtWriter.WriteList("spawn_conditions", 0x0A, [
            nbtWriter.WriteCompound("", [
                nbtWriter.WriteCompound("condition", [
                    nbtWriter.WriteString("type", "minecraft:biome"),
                    nbtWriter.WriteString("biomes", "#minecraft:spawns_warm_variant_frogs")
                ]),
                nbtWriter.WriteInt("priority", 1)
            ])
        ])
    ])}])
}

/** @param {Socket} socket  */
function WritePaintingVariantRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:painting_variant", [{entryID: "minecraft:dennis", data: nbtWriter.WriteNBT([
        nbtWriter.WriteString("asset_id", "minecraft:dennis"),
        nbtWriter.WriteCompound("title", [
            nbtWriter.WriteString("color", "yellow"),
            nbtWriter.WriteString("translate", "painting.minecraft.dennis.title")
        ]),
        nbtWriter.WriteCompound("author", [
            nbtWriter.WriteString("color", "gray"),
            nbtWriter.WriteString("translate", "painting.minecraft.dennis.author")
        ]),
        nbtWriter.WriteInt("width", 3),
        nbtWriter.WriteInt("height", 3)
    ])}])
}

/** @param {Socket} socket  */
function WritePigVariantRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:pig_variant", [{entryID: "minecraft:cold", data: nbtWriter.WriteNBT([
        nbtWriter.WriteString("asset_id", "minecraft:entity/pig/cold_pig"),
        nbtWriter.WriteList("spawn_conditions", 0x0A, [
            nbtWriter.WriteCompound("", [
                nbtWriter.WriteCompound("condition", [
                    nbtWriter.WriteString("type", "minecraft:biome"),
                    nbtWriter.WriteString("biomes", "#minecraft:spawns_cold_variant_farm_animals")
                ]),
                nbtWriter.WriteInt("priority", 1)
            ])
        ])
    ])}])
}

/** @param {Socket} socket  */
function WriteWolfSoundVariantRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:wolf_sound_variant", [{entryID: "minecraft:angry", data: nbtWriter.WriteNBT([
        nbtWriter.WriteString("ambient_sound", "minecraft:entity.wolf_angry.ambient"),
        nbtWriter.WriteString("death_sound", "minecraft:entity.wolf_angry.death"),
        nbtWriter.WriteString("growl_sound", "minecraft:entity.wolf_angry.growl"),
        nbtWriter.WriteString("hurt_sound", "minecraft:entity.wolf_angry.hurt"),
        nbtWriter.WriteString("pant_sound", "minecraft:entity.wolf_angry.pant"),
        nbtWriter.WriteString("whine_sound", "minecraft:entity.wolf_angry.whine")
    ])}])
}

/** @param {Socket} socket  */
function WriteWolfVariantRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:wolf_variant", [{entryID: "minecraft:chestnut", data: nbtWriter.WriteNBT([
        nbtWriter.WriteCompound("assets", [
            nbtWriter.WriteString("angry", "minecraft:entity/wolf.wolf_chestnut_angry"),
            nbtWriter.WriteString("tame", "minecraft:entity/wolf.wolf_chestnut_tame"),
            nbtWriter.WriteString("wild", "minecraft:entity/wolf.wolf_chestnut_wild")
        ]),
        nbtWriter.WriteList("spawn_conditions", 0x0A, [
            nbtWriter.WriteCompound("", [
                nbtWriter.WriteCompound("condition", [
                    nbtWriter.WriteString("type", "minecraft:biome"),
                    nbtWriter.WriteString("biomes", "minecraft:old_growth_spruce_taiga")
                ]),
                nbtWriter.WriteInt("priority", 1)
            ])
        ])
    ])}])
}

/** @param {Socket} socket  */
function WriteWorldGen_BiomeRegistry(socket) {
    packetWriter.configuration.registry_data.write(socket, "minecraft:worldgen/biome", [{entryID: "minecraft:plains", data: nbtWriter.WriteNBT([
        nbtWriter.WriteList("carvers", 0x08, [
            nbtWriter.WriteString("", "minecraft:cave"),
            nbtWriter.WriteString("", "minecraft:cave_extra_underground"),
            nbtWriter.WriteString("", "minecraft:canyon")
        ]),
        nbtWriter.WriteFloat("downfall", 0.4),
        nbtWriter.WriteCompound("effects", [
            nbtWriter.WriteInt("fog_color", 12638463),
            nbtWriter.WriteCompound("mood_sound", [
                nbtWriter.WriteInt("block_search_extent", 8),
                nbtWriter.WriteFloat("offset", 2.0),
                nbtWriter.WriteString("sound", "minecraft:ambient.cave"),
                nbtWriter.WriteInt("tick_delay", 6000)
            ]),
            nbtWriter.WriteFloat("music_volume", 1.0),
            nbtWriter.WriteInt("sky_color", 7907327),
            nbtWriter.WriteInt("water_color", 4159204),
            nbtWriter.WriteInt("water_fog_color", 329011)
        ]),
        nbtWriter.WriteList("features", 0x09, [
            nbtWriter.WriteList("", 0x08, []),
            nbtWriter.WriteList("", 0x08, [
                nbtWriter.WriteString("", "minecraft:lake_lava_underground"),
                nbtWriter.WriteString("", "minecraft:lake_lava_surface")
            ]),
            nbtWriter.WriteList("", 0x08, [
                nbtWriter.WriteString("", "minecraft:amethyst_geode")
            ]),
            nbtWriter.WriteList("", 0x08, [
                nbtWriter.WriteString("", "minecraft:monster_room"),
                nbtWriter.WriteString("", "minecraft:monster_room_deep")
            ]),
            nbtWriter.WriteList("", 0x08, []),
            nbtWriter.WriteList("", 0x08, []),
            nbtWriter.WriteList("", 0x08, [
                nbtWriter.WriteString("", "minecraft:ore_dirt"),
                nbtWriter.WriteString("", "minecraft:ore_gravel"),
                nbtWriter.WriteString("", "minecraft:ore_granite_upper"),
                nbtWriter.WriteString("", "minecraft:ore_granite_lower"),
                nbtWriter.WriteString("", "minecraft:ore_diorite_upper"),
                nbtWriter.WriteString("", "minecraft:ore_diorite_lower"),
                nbtWriter.WriteString("", "minecraft:ore_andesite_upper"),
                nbtWriter.WriteString("", "minecraft:ore_andesite_lower"),
                nbtWriter.WriteString("", "minecraft:ore_tuff"),
                nbtWriter.WriteString("", "minecraft:ore_coal_upper"),
                nbtWriter.WriteString("", "minecraft:ore_coal_lower"),
                nbtWriter.WriteString("", "minecraft:ore_iron_upper"),
                nbtWriter.WriteString("", "minecraft:ore_iron_middle"),
                nbtWriter.WriteString("", "minecraft:ore_iron_small"),
                nbtWriter.WriteString("", "minecraft:ore_gold"),
                nbtWriter.WriteString("", "minecraft:ore_gold_lower"),
                nbtWriter.WriteString("", "minecraft:ore_redstone"),
                nbtWriter.WriteString("", "minecraft:ore_redstone_lower"),
                nbtWriter.WriteString("", "minecraft:ore_diamond"),
                nbtWriter.WriteString("", "minecraft:ore_diamond_medium"),
                nbtWriter.WriteString("", "minecraft:ore_diamond_large"),
                nbtWriter.WriteString("", "minecraft:ore_diamond_buried"),
                nbtWriter.WriteString("", "minecraft:ore_lapis"),
                nbtWriter.WriteString("", "minecraft:ore_lapis_buried"),
                nbtWriter.WriteString("", "minecraft:ore_copper"),
                nbtWriter.WriteString("", "minecraft:underwater_magma"),
                nbtWriter.WriteString("", "minecraft:disk_sand"),
                nbtWriter.WriteString("", "minecraft:disk_clay"),
                nbtWriter.WriteString("", "minecraft:disk_gravel")
            ]),
            nbtWriter.WriteList("", 0x08, []),
            nbtWriter.WriteList("", 0x08, [
                nbtWriter.WriteString("", "minecraft:spring_water"),
                nbtWriter.WriteString("", "minecraft:spring_lava")
            ]),
            nbtWriter.WriteList("", 0x08, [
                nbtWriter.WriteString("", "minecraft:glow_lichen"),
                nbtWriter.WriteString("", "minecraft:patch_tall_grass_2"),
                nbtWriter.WriteString("", "minecraft:patch_bush"),
                nbtWriter.WriteString("", "minecraft:trees_plains"),
                nbtWriter.WriteString("", "minecraft:flower_plains"),
                nbtWriter.WriteString("", "minecraft:patch_grass_plain"),
                nbtWriter.WriteString("", "minecraft:brown_mushroom_normal"),
                nbtWriter.WriteString("", "minecraft:red_mushroom_normal"),
                nbtWriter.WriteString("", "minecraft:patch_pumpkin"),
                nbtWriter.WriteString("", "minecraft:patch_sugar_cane"),
                nbtWriter.WriteString("", "minecraft:patch_firefly_bush_near_water")
            ]),
            nbtWriter.WriteList("", 0x08, [
                nbtWriter.WriteString("", "minecraft:freeze_top_layer")
            ]),
        ]),
        nbtWriter.WriteByte("has_precipitation", 1),
        nbtWriter.WriteCompound("spawn_costs", []),
        nbtWriter.WriteCompound("spawners", [
            nbtWriter.WriteList("ambient", 0x0A, [
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:bat"),
                    nbtWriter.WriteInt("maxCount", 8),
                    nbtWriter.WriteInt("minCount", 8),
                    nbtWriter.WriteInt("weight", 10)
                ])
            ]),
            nbtWriter.WriteList("axolotls", 0x0A, []),
            nbtWriter.WriteList("creature", 0x0A, [
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:sheep"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 12)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:pig"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 10)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:chicken"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 10)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:cow"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 8)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:horse"),
                    nbtWriter.WriteInt("maxCount", 6),
                    nbtWriter.WriteInt("minCount", 2),
                    nbtWriter.WriteInt("weight", 5)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:donkey"),
                    nbtWriter.WriteInt("maxCount", 3),
                    nbtWriter.WriteInt("minCount", 1),
                    nbtWriter.WriteInt("weight", 1)
                ])
            ]),
            nbtWriter.WriteList("misc", 0x0A, []),
            nbtWriter.WriteList("monster", 0x0A, [
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:spider"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 100)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:zombie"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 95)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:zombie_villager"),
                    nbtWriter.WriteInt("maxCount", 1),
                    nbtWriter.WriteInt("minCount", 1),
                    nbtWriter.WriteInt("weight", 5)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:skeleton"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 100)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:creeper"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 100)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:slime"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 100)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:enderman"),
                    nbtWriter.WriteInt("maxCount", 4),
                    nbtWriter.WriteInt("minCount", 1),
                    nbtWriter.WriteInt("weight", 10)
                ]),
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:witch"),
                    nbtWriter.WriteInt("maxCount", 1),
                    nbtWriter.WriteInt("minCount", 1),
                    nbtWriter.WriteInt("weight", 5)
                ])
            ]),
            nbtWriter.WriteList("underground_water_creature", 0x0A, [
                nbtWriter.WriteCompound("", [
                    nbtWriter.WriteString("type", "minecraft:glow_squid"),
                    nbtWriter.WriteInt("maxCount", 6),
                    nbtWriter.WriteInt("minCount", 4),
                    nbtWriter.WriteInt("weight", 10)
                ])
            ]),
            nbtWriter.WriteList("water_ambient", 0x0A, []),
            nbtWriter.WriteList("water_creature", 0x0A, [])
        ]),
        nbtWriter.WriteFloat("temperature", 0.8)
    ])}])
}

module.exports = {WriteAllRegistries}