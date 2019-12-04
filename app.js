const express = require('express');
const expressWebSocket = require('express-ws');
const websocketStream = require('websocket-stream/stream');
const ffmpeg = require('fluent-ffmpeg')
const logger = require('./config/log.js')
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
    logger.info("rtsp url:", url)

    try {
        ffmpeg(url)
            .addInputOption("-rtsp_transport", "tcp")
            .on("start", function () {
                logger.debug("Stream started.");
            })
            .on("codecData", function (data) {
                logger.debug(`Input is ${data.video} video`);
            })
            .on("error", function (err) {
                logger.debug("An error occured: ", err.message);
            })
            .on("end", function () {
                logger.debug("Stream end!");
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
        logger.error(error);
    }
});
app.listen(9090);
logger.debug("express listened on 9090")