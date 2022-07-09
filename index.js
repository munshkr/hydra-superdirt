const OSC = require('osc-js')

const config = {
    wsServer: { port: 8080 },
    udpClient: { port: 9129 },
    udpServer: { port: 9130 },
}
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) })

osc.on('/rms', message => {
    console.log("RMS", message.args)
})

osc.on('open', () => {
    console.log("Port is open now.")
    const message = new OSC.Message('/test', 12.221, 'hello')
    osc.send(message)
})

osc.open()