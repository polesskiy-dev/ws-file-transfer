import cbor from 'cbor';

const CHUNK_SIZE = 128;
let ws = null;

// DOM elements
const uploadURLInput = document.querySelector('#upload-url');
const fileInput = document.querySelector('#file-input');
const uploadButton = document.querySelector('#upload-button');
const closeConnectionButton = document.querySelector('#close-connection');

const getFileChunks = (fileDescription, buffer, chunkSize = CHUNK_SIZE) => {
    const { name: fileName, size: fileSize, type: fileType } = fileDescription;
    const chunks = [];

    for (let i = 0; i * chunkSize < buffer.byteLength; i++) {
        const offset = i * chunkSize;
        const data = buffer.slice(offset, offset + chunkSize);

        const chunk = {
            command: 100,
            offset,
            data,
            fileName,
            fileSize,
            fileType
        };

        chunks.push(chunk);
    }

    return chunks;
};

const initWSConnection = () => {
    const uploadUrl = uploadURLInput.value;

    ws = new WebSocket(uploadUrl);

    ws.onopen = () => console.log('connected');
    ws.onclose = () => console.log('connection closed');
    ws.onerror = e => console.error(e);
};

const closeWSConnection = () => {
    if (ws instanceof WebSocket) ws.close();
};

const handleUpload = () => {
    initWSConnection();

    const fileDescription = fileInput.files[0];
    const fileReader = new FileReader();

    ws.onopen = () => {
        fileReader.onloadend = () => {
            const buffer = fileReader.result;

            const chunks = getFileChunks(fileDescription, buffer);

            // send chunks
            chunks.forEach(chunk => ws.send(cbor.encode(chunk)));
        };

        fileReader.readAsArrayBuffer(fileDescription);
    };
};

// assign click handlers on buttons
uploadButton.addEventListener('click', handleUpload);
closeConnectionButton.addEventListener('click', closeWSConnection);
