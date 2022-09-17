#!/usr/bin/env node

const OSC = require('osc-js')
const program = require('commander');
const packageInfo = require('../package.json')

program
  .version(packageInfo.version)
  .option('-p, --port <number>', 'WebSocket port', 8080)
  .option('--osc-port <number>', 'OSC port', 9130)
  .option('-v, --verbose', 'Be verbose (print OSC messages)', false)
  .parse(process.argv)

const options = program.opts();

console.log(`hydra-superdirt ${packageInfo.version} - OSC-WebSocket bridge`)

const osc = new OSC({
  plugin: new OSC.BridgePlugin({
    wsServer: { port: options.port },
    udpServer: { port: options.oscPort, host: "0.0.0.0" },
  })
})

if (options.verbose) {
  console.log("Verbose is ON. It will print *all* OSC messages, so performance will be degraded.")
  osc.on('/rms', message => {
    console.log("RMS", message.args)
  })
}

osc.on('open', () => {
  console.log(
    `Listening on port ${options.port}. ` +
    `Will redirect RMS messages to UDP port ${options.oscPort}.`
  )
})

osc.open()