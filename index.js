(async () => {

  let rms = {}
  let rmsCallbacks = {}

  window.rms = (orbit) => {
    return rms[orbit] || 0
  }

  window.onRms = (callback, orbit) => {
    rmsCallbacks[orbit] = callback
  }

  //

  await loadScript("https://unpkg.com/osc-js")
  console.log("osc-js loaded")

  let oscSrv = new OSC();

  oscSrv.on('/rms', msg => {
    console.debug("RMS:", msg.args)
    const orbit = msg.args[2]
    rms[orbit] = msg.args[3]
  })

  oscSrv.on('open', () => {
    console.log("OSC-WS connection open")
  })

  oscSrv.on('close', () => {
    console.log("OSC-WS connection closed")
  })

  window.oscConnect = (otherPort) => {
    oscSrv.open({ port: otherPort || 8080 })
  }

  window.oscDisconnect = () => {
    oscSrv.close()
  }

})();