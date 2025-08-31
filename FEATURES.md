# Features

## General
All connections to the server are completely independant of each other. This is completely different to all regular servers because it means that if two people are connected to the server at the same time, they will not see each other. They will also have completely different blocks and entities.

In addition, anything you do in the server does not save between sessions. Every time you rejoin it will be set back to it's original state.

## Status
The server status shows a player count of -1 out of 999999 players. There is only one listed player with obfuscated text.

The server description is similarly obfuscated text but with extra red coloring.

If in an older version of Minecraft, the server description and listed player will become "Outdated Client" with a player count of 0 / 0

This is mirrored in newer versions of Minecraft with the text "Outdated Server"

## Login
Attempting to join on a older version of Minecraft will immediately disconnect and display the text "Outdated Client: x (expected 772)" with x being the server protocol number

Similarly, on a newer version it will display the text "Outdated Server: 772 (client on x)"

## World Gen
The world generates as a 16 x 16 x 16 cube of stone at the bottom of chunk (0, 0) in the overworld.

The origin chunk spawns with a 5 x 5 area of empty chunks around it (2 out in each direction) for rendering purposes client-side. All future generated chunks have a 3 x 3 area of empty chunks around it (1 out in each direction). See [Minecraft Wiki - Java edition protocol/Chunk Format](https://minecraft.wiki/w/Java_Edition_protocol/Chunk_format#Tips_and_notes)

The player spawns at (0, 0, 0)

## World Limits
Going below y = -128 teleports the player to (8, -10, 8).
## Chat Commands

### "new"
Typing "new" in chat will replace the cube of stone with a cube of any random block in any random state

### "load all"
Typing "load all" in chat will load all possible blocks and their states in an 11 x 11 square of chunks. This is similar to the Debug world type already in Minecraft, but without the gaps in between blocks.

It will also send a message back in chat upon completion stating "Loaded All x Block States" where x is the number of block states in the game.

### x, y
Typing in the format "x, y" where x and y are both whole numbers, will set that chunk to a cube of stone like the original one upon world gen.

These are not block coordinates, but rather chunk coordinates, eg. 1, 1 would be the chunk with blocks 16, 16.

### "reset"
This causes the player to rejoin the server by transfering them to the same host ("localhost:25565"), which will cause the world to be back to just a stone cube.

## Placing Blocks
Placing any block will replace the chunk that the block is in with a 16 x 16 x 16 cube of that block like the original stone cube and will immediately remove the block that you placed.

If the block is placed on the top or bottom face of a block and it is on the border of another chunk, it will set the bordering chunk to that block. The same goes for corners.

The only exception to this happening is concrete blocks, which can be placed freely.

This block placing feature has been extended to a few items as well:
- Stick --> Air
- Water Bucket --> Water
- Lava Bucket --> Lava
- Flint and Steel --> Fire
- Eye of Ender --> Random Block

## Item Actions

### Name Tag
Left clicking with a name tag in hand will cause a waypoint to be added at the players position.

### Armor Stand
Left clicking with an armor stand in hand will cause all waypoints to be removed.

This will be changed to left click.

### Diamond
Left clicking with a diamond in hand will open the player creation menu. See details below.

### Gunpowder
Left clicking with gunpowder in hand will remove the last made NPC.

### Redstone Dust
Left clicking with redstone dust in hand will remove all NPCs.

## NPC Creation

### General
Left clicking with a diamond in hand will enter NPC creation mode. It will replace all items in the hotbar with 7 items for NPC creation.

Trying to replace the items in your hotbar while in NPC creation mode will simply replace them again with the items for NPC creation.

### Stick
Left clicking this item will cause an armor stand to appear at the players position. This is an animation marker.

### Flint and Steel
Left clicking this item will remove the last animation marker.

### Lava Bucket
Left clicking this item will remove all animation markers, but will preserve all other settings as they are.

### TNT
This will exit player creation mode. All animation markers will be removed and all other settings reset to their default state for the next time player creation mode is entered.

This will also reset the hotbar to its original state before player creation mode was entered.

### Clock
Left clicking this item will cycle between animation speeds ranging from 0.25 to 128 and defaulting at 16

The selected speed is displayed in the actionbar for a couple seconds before fading away.

### Name Tag
Left clicking this item will open a sign editor screen. This is used to rename the NPC that is spawned.

If the name is set to the identifier of an entity of than the player (eg. minecraft:pig) it will spawn that entity instead of a player with that name.
See [Minecraft Wiki - Java edition data values](https://minecraft.wiki/w/Java_Edition_data_values#Entities) for a list of entity identifiers without the "minecraft:" prefix.

The name of a player NPC must be 16 characters or less. There can not be two player NPCs with the same name, all duplicates will simply be invisible. This does not apply to non-player NPCs.

Exiting the sign menu sets the name to whatever is typed into the sign. If the sign is blank, the action is simply cancelled.

The default name is minecraft:zombie.

### Diamond
Left clicking this item will complete the animation and you will see the animated NPC moving around at a constant speed through the markers.

If there are 0 animation markers, it will spawn an unmoving statue at the player's position

If there is 1 animation marker or multiple animation markers within a small enough distance, it will spawn an unmoving marker at the position of the first marker.

This will also reset your inventory to its original state.

## Auto NPC Creation

### General
This is similar to regular NPC Creation but instead of recording individual animation markers and playing them at a constant speed in blocks per second, it records the player's position and rotation every tick and plays it back.

It is activated by left clicking with an emerald.

### Honeycomb
Left clicking cycles the syncronization channel of the animation. This is used to align multiple NPCs frames to simulate interaction.

By default it is set to not syncronize

### Stick
Left clicking starts a 3 second countdown to start recording the animation. Upon the text "GO", a zombie will spawn at the player's position as a marker of where to loop back to at the end of the animation.

A counter will show how much time has passed if not syncronized, and it will show how much time is left if it is syncronized

All other NPCs that it is syncronized to will pause on their first frame during the countdown and will playback syncronized to the recording.

If the NPC is not syncronized, the recording can be stopped by left clicking with the stick again. If it is, the recording will stop when the counter reaches 0.

### Lava Bucket
During or after recording, the lava bucket will appear.

Left clicking it will remove the existing recording and allow it to be re-recorded.

All other settings such as syncronization and name are preserved.

### TNT
Left clicking the TNT will exit Auto NPC Creation Mode and set the hotbar to its previous state.

This resets all settings for the next time an NPC is created.

### Name Tag
This works exactly as in regular NPC Creation Mode.

Is only available before or after recording.

### Emerald
Creates the NPC and exits Auto NPC Creation Mode.

If syncronized, it will spawn at the frame of the syncronization instead of the first frame.

## Debug

### General
Any time the player flies, the text "You started flying" will be displayed in chat

### Terminal
Select packets that are recieved and written are logged to the terminal as well as initial information about loaded registries.

### Logs
After a player is disconnected from the server in any way, a file is created in the logs folder indexed by the order of when it first connected.

This log contains all packets that were sent and recieved. It also contains all state changes and the reason the connection was closed.