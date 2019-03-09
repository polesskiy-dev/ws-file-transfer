# CBOR websocket file transfer example

This project demonstrates:
* file split to constant size chunks
* transfer CBOR encoded chunks by WebSocket
* receive chunks and decode them
* concatenate chunks and save them to filesystem with same file name 

## Build & run

```
$ npm install
$ npm run build

# run server (on ws://localhost:8081)
$ node server.js

# open page
$ open index.html
```

## Steps description
Buttons:
* `Choose file` - opens dialog window to choose file
* `Upload` - opens WS connection and sends file chunks
* `Close connection` - closes WS connection

Server saves the file when total chunks size reaches original file size

## Protocol description

* command - your command (100 by default)
* offset - offset from 0 byte of file
* data - actual file data chunk with 128 bytes length
* fileName - file name 
* fileSize - total file size
* fileType - MIME type


