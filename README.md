# hydra-superdirt

A Hydra extension for handling SuperDirt RMS events (envelope follower)

This repository contains the source code of a [Hydra](https://hydra.ojack.xyz/)
extension that handles RMS messages sent by
[SuperDirt](https://github.com/musikinformatik/SuperDirt), and an OSC-WebSocket
bridge application that forwards OSC messages to the browser.

Watch demo:

[![Simple demo](https://img.youtube.com/vi/i5JoCTLqGSw/0.jpg)](https://www.youtube.com/watch?v=i5JoCTLqGSw)


## Install

Download the latest binary file at
[Releases](https://github.com/munshkr/hydra-superdirt/releases) corresponding to
your operating system (Linux, MacOs and Windows supported) and put it somewhere.

## Usage

Start Supercollider and SuperDirt.

On SC, execute this:

```c
(
// Run this to start sending the RMS OSC messages to SC.
~dirt.startSendRMS;

~dirt.orbits.collect { |orbit, i|
	// Set default reply rate and peak lag
	// (this can also be set on the event itself (i.e. Tidal)
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
```

You can stop sending RMS events with:

```c
~dirt.stopSendRMS;
```

Then, start the bridge by executing the binary, which will create a WebSockets
server at 8080 and open a UDP port on 9130 by default.

On Hydra, execute first:

```js
// Load osc-js script
loadScript("https://unpkg.com/hydra-superdirt")
```

Then, to connect:

```js
rmsConnect()
```

Now you can try evaluating on Tidal something like: `d1 $ s "bd sd"`

On Hydra, try this:

```js
solid(() => rms(0)).out()
```

You should see a red tint that fades to black every time the samples are played.

### Functions

* `rmsConnect(port)`: Connect to the WS-OSC bridge. By default it will connect
  to port 8080, but can be changed. If it's different than 8080, make sure to
  set `--port` with the correct port number when running the bridge.

* `rmsDisconnect()`: Disconnect from the WS-OSC bridge.

* `rms(orbit)`: Returns the latest RMS value received on `orbit`. When `orbit`
  is not specified, it will default to orbit 0. If no message has been received
  yet on that orbit, it will return 0.

* `rmsOn(orbit, callback)`: Assigns a callback function whenever a new RMS
  value is received on `orbit`.

* `rmsReset(orbit)`: Resets the callback function of an orbit. If `orbit` is not
  specified, it will reset all callback functions.

## Development

You need to install [Node](https://nodejs.org/en/) and
[Yarn](https://yarnpkg.com/).  Then, clone the repository, and from within the
cloned directory run `yarn` to install all dependencies.

You can start the bridge by running `yarn start` or `bin/hydra-sc-bridge.js`.
`index.js` contains the source code of the Hydra extension.

## Contributing

Bug reports and pull requests are welcome on GitHub at the [issues
page](https://github.com/munshkr/hydra-superdirt). This project is intended to
be a safe, welcoming space for collaboration, and contributors are expected to
adhere to the [Contributor Covenant](http://contributor-covenant.org) code of
conduct.

## License

This project is licensed under GPL 3+. Refer to [LICENSE.txt](LICENSE.txt)
