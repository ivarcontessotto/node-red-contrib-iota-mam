# Node-red mam module

## Requirements

node-red installed

# Installation

Run the following command in your NODE-RED install
```
npm install node-red-contrib-iota-mam
```

# Usage

Two different nodes available for
MAM publish (=upload data to tangle) and MAM fetch (=download data from tangle)

Drag mam function node into a flow and wire it with

a) MAM fetch

- an input inject (msg.payload = "your MAM_ROOT")
- any output ( e.g. a chart displaying your msg.payload)

Start injecting the payload on the mam function node once and it will
automatically fetch all mam stream data available

b) MAM publish

- an input data source (e.g. sensorTag)
- (optional) output for logging
