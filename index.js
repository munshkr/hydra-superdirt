(async () => {

  await loadScript("https://unpkg.com/osc-js")
  console.log("[hydra-superdirt] osc-js loaded")

  let oscSrv = new OSC();
  let rms = {}
  let rmsCallbacks = {}

  oscSrv.on('/rms', msg => {
    console.debug("[hydra-superdirt] RMS:", msg.args)
    const orbit = msg.args[2]
    rms[orbit] = msg.args[3]
    if (rmsCallbacks[orbit]) {
      rmsCallbacks[orbit](value)
    }
  })

  oscSrv.on('open', () => {
    console.log("[hydra-superdirt] OSC-WS connection open")
  })

  oscSrv.on('close', () => {
    console.log("[hydra-superdirt] OSC-WS connection closed")
  })

  ///
  // Public API
  //

  // Connect to the WS-OSC bridge. By default it will connect to port 8080, but can be changed.
  window.rmsConnect = (otherPort) => {
    oscSrv.open({ port: otherPort || 8080 })
  }

  // Disconnect from the WS-OSC bridge.
  window.rmsDisconnect = () => {
    oscSrv.close()
  }

  // Returns the latest RMS value received on `orbit`, or 0
  window.rms = (orbit) => {
    return rms[orbit] || 0
  }

  // Calls a callback function whenever a new RMS value is received for `orbit`.
  // The callback function will receive the RMS value as argument.
  window.rmsOn = (callback, orbit) => {
    rmsCallbacks[orbit] = callback
  }

  // Resets callback functions for a specific `orbit`. If undefined, resets callbacks for all orbits.
  window.rmsReset = (orbit) => {
    if (orbit) {
      delete rmsCallbacks[orbit]
    } else {
      rmsCallbacks = {}
    }
  }

})();