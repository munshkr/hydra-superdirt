# superdirt-ws

## Usage

Start Supercollider and SuperDirt.

On SC, execute this:

```
~dirt.startSendRMS;

(
~dirt.orbits.collect { |orbit, i|
	orbit.defaultParentEvent.put(\rmsReplyRate, 8).put(\rmsPeakLag, 3);
};

b = NetAddr.new("127.0.0.1", 9130);

OSCFunc({ |msg|
	// send OSC message to WS bridge
	b.sendMsg("/rms", *msg);
}, "/rms");
)

// to stop it
~dirt.stopSendRMS;
```

Then, run `npm start` to start WebSockets server at 8080. UDP port is 9130.

On Hydra:

```js
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

// connect to WS server (by default port 8080)
oscSrv.open();

///

// test on tidal: d1 $ s "bd sd"
// on hydra:
solid(() => rms(0)).out()
```
