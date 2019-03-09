const fs = require('fs');
const path = require('path');
const cbor = require('cbor');
const WebSocket = require('ws');

// WebSocket-server on 8081
const webSocketServer = new WebSocket.Server({
    port: 8081,
});

webSocketServer.on('connection', (ws) => {
    const id = Math.random();
    console.log(`connection opened ${id}`);

    const file = {
        data: [],
        name: '',
        size: null,
    };

    const saveFile = () => {
        console.log(`saving file ${file.name}`);
        const buffer = Buffer.concat(file.data);

        fs.writeFileSync(path.resolve(__dirname, file.name), buffer);
    };

    ws.on('message', (message) => {
        console.log(`message received ${message.length}`);

        cbor.decodeFirst(message, (err, chunk) => {
            if (err) console.error(err);

            console.log(chunk);

            file.name = chunk.fileName;
            file.data.push(chunk.data);
            file.size = chunk.fileSize;

            if (chunk.offset + chunk.data.length >= file.size) saveFile();
        });

    });

    ws.on('close', () => {
        console.log(`connection closed ${id}`);
    });
});
