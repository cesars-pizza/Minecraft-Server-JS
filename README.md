Minecraft Server JS [![Build Status](https://api.travis-ci.com/cesars-pizza/Minecraft-Server-JS.png)](https://api.travis-ci.com/cesars-pizza/Minecraft-Server-JS)
======

By Cesar Vigil from the amazing work of the [Minecraft Wiki](minecraft.wiki)

Minecraft Server JS is just a simple attempt at recreating a bare bones version of the Minecraft 1.21.8 server to mess around with it and understand how the internals of minecraft work.

Usage
-----

To run it, simply run `node server.js` in the root directory of the project.

To connect to the server, you just add a server on Minecraft Java Edition 1.21.8 with any name and the server address set to `localhost` or `localhost:25565` and join.

To change the port that the server is hosted on, you have to change it in two places:

[server.js](https://github.com/cesars-pizza/Minecraft-Server-JS/blob/main/server.js) (lines 124-126):
```js
    server.listen(25565, () => {
        console.log('TCP server listening on port 25565');
    });
```
[data_handlers/packet_reader/play/8_chat.js](https://github.com/cesars-pizza/Minecraft-Server-JS/blob/main/data_handlers/packet_reader/play/8_chat.js) (lines 39-41):
```js
    else if (message.value == "reset") {
        packetWriter.play.transfer.buffer(socket, "localhost", 25565)
    }
```

If you want to connect to the server outside of your machine or network, adjust the server address accordingly, as well as changing it in the code.

[data_handlers/packet_reader/play/8_chat.js](https://github.com/cesars-pizza/Minecraft-Server-JS/blob/main/data_handlers/packet_reader/play/8_chat.js) (lines 39-41):
```js
    else if (message.value == "reset") {
        packetWriter.play.transfer.buffer(socket, "localhost", 25565)
    }
```

Features
-----
See [FEATURES.md](https://github.com/cesars-pizza/Minecraft-Server-JS/blob/main/FEATURES.md)

Copyright
-----
This project does not use any code sourced directly from Minecraft. It simply follows a protocol found within the game. 

The protocol and information that this project is built upon is protected by the terms of [CC BY-SA 3.0 Unported](https://creativecommons.org/licenses/by-sa/3.0).

This project is free to share and adapt so long as it is given proper credit.