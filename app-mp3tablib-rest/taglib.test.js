const NodeID3 = require('node-id3');
const fs = require('fs');
const filePath = 'G:/Behen Ki Shaadi Raju Shrivastav.mp3';
let tags = {
    title:'abc test 1',
    artist:'abc test artist 1',
    album:'abc test album 1'
};

let ID3FrameBuffer = NodeID3.create(tags);
let success = NodeID3.write(tags, filePath);
console.log(success);
