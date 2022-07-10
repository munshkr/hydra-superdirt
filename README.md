# superdirt-ws

This is a very simple OSC-WebSocket bridge application written in Node (using [osc-js](https://github.com/adzialocha/osc-js)), as an example to send the RMS events from [SuperDirt](https://github.com/musikinformatik/SuperDirt) to use them on [Hydra](https://hydra.ojack.xyz/).


## Install

You need to install [Node](https://nodejs.org/en/).  Then, clone the repository, and from within the cloned directory run `npm install`.


## Usage

Start Supercollider and SuperDirt.

On SC, execute this:

```
// Run this to start sending the RMS OSC messages to SC.
~dirt.startSendRMS;

(
~dirt.orbits.collect { |orbit, i|
	// Set default reply rate and peak lag (this can also be set on the event itself (i.e. Tidal)
	orbit.defaultParentEvent.put(\rmsReplyRate, 8).put(\rmsPeakLag, 3);
};

// The bridge will be listening to OSC messages on port UDP 9130.
b = NetAddr.new("127.0.0.1", 9130);

// This is the RMS OSC handler, here we'll forward these messages to our bridge
OSCFunc({ |msg|
	// Forward OSC message
	b.sendMsg("/rms", *msg);
}, "/rms");
)

// You can stop sending RMS events with:
~dirt.stopSendRMS;
```

Then, run `npm start` to start the bridge, which will start a WebSockets server at 8080 and open a UDP port on 9130.

On Hydra:

```js
// Load osc-js script
loadScript("https://unpkg.com/osc-js")

// Create rms() function to read RMS from OSC-WS bridge
if (!window._rmsLoaded) {
  _rmsLoaded = true
  _rms = {}
  oscSrv = new OSC();
  oscSrv.on('/rms', msg => {
    console.debug("RMS:", msg.args)
    const orbit = msg.args[2]
    _rms[orbit] = msg.args[3]
  })
  function rms(orbit) {
    return _rms[orbit] || 0
  }
  console.log("RMS Ready")
}

// Connect to WS server (port 8080 when not specified)
oscSrv.open();

///

// Try evaluating on Tidal something like: d1 $ s "bd sd"
// On hydra, for instance:
solid(() => rms(0)).out()
```
