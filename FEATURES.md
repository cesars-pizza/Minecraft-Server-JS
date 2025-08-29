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

## Player Creation

### General
Left clicking with a diamond in hand will open the player creation menu. It will replace all items in the hotbar with 7 items.

Trying to replace the items in your hotbar while in player creation mode will simply replace them again with the items for player creation.

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
Left clicking this item will open a sign editor screen. This is used to rename the player that is spawned.

If the name is set to the identifier of an entity of than the player (eg. minecraft:pig) it will spawn that entity instead of a player with that name.
See [Minecraft Wiki - Java edition data values](https://minecraft.wiki/w/Java_Edition_data_values#Entities) for a list of entity identifiers without the "minecraft:" prefix.

The name of a player must be 16 characters or less. There can not be two players with the same name, all duplicates will simply be invisible. This does not apply to non-player entities.

Exiting the sign menu sets the name to whatever is typed into the sign. If the sign is blank, the action is simply cancelled.

The default name is minecraft:zombie.

### Diamond
Left clicking this item will complete the animation and you will see the animated player / entity moving around at a constant speed through the markers.

This will also reset your inventory to its original state.

## Debug

### General
Any time the player flies, the text "You started flying" will be displayed in chat

### Terminal
Select packets that are recieved and written are logged to the terminal as well as initial information about loaded registries.

### Logs
After a player is disconnected from the server in any way, a file is created in the logs folder indexed by the order of when it first connected.

This log contains all packets that were sent and recieved. It also contains all state changes and the reason the connection was closed.