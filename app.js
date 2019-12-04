const express = require('express');
const expressWebSocket = require('express-ws');
const websocketStream = require('websocket-stream/stream');
const ffmpeg = require('fluent-ffmpeg')
const app = express();

// extend express app with app.ws()
expressWebSocket(app, null, {
    // ws options here
    perMessageDeflate: false,
});

app.ws("/", function (ws, req) {
    const stream = websocketStream(ws, {
        binary: true,
        browserBufferTimeout: 1000000
    }, {
        browserBufferTimeout: 1000000
    });
    let url = req.query.url;
    console.log("rtsp url:", url);
    console.log("rtsp params:", req.params);

    try {
        ffmpeg(url)
            .addInputOption("-rtsp_transport", "tcp")
            .on("start", function () {
                console.log("Stream started.");
            })
            .on("codecData", function (data) {
                console.log(`Input is ${data.video} video`);
            })
            .on("error", function (err) {
                console.log("An error occured: ", err.message);
            })
            .on("end", function () {
                console.log("Stream end!");
            })
            .outputOptions([
                '-b:v 2000k',
                '-bufsize 2000k',
                '-maxrate 3500k',
                '-muxdelay 0.001',
                '-tune zerolatency',
                '-preset ultrafast',
            ])
            .fps(25)
            .outputFormat("flv")
            .videoCodec("copy")
            .noAudio().pipe(stream);
    } catch (error) {
        console.log(error);
    }
});
app.listen(9090);
console.log("express listened")