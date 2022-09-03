#!/usr/bin/env node

const OSC = require('osc-js')
const packageInfo = require('../package.json');

const config = {
  wsServer: { port: 8080 },
  udpClient: { port: 9129 },
  udpServer: { port: 9130 },
}
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) })

// osc.on('/rms', message => {
//     console.log("RMS", message.args)
// })

osc.on('open', () => {
  console.log(
    `Listening on port ${config.wsServer.port}. ` +
    `Will redirect RMS messages to UDP port ${config.udpServer.port}.`
  )
})

console.log(`hydra-superdirt ${packageInfo.version} - OSC-WebSocket bridge`)
osc.open()