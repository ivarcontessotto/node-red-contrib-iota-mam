# Node-red mam module

## Requirements

node-red installed
add npm modules "node-red-dashboard" and "node-red-contrib-sensortag")

# Installation

Run the following command in your NODE-RED install
```
npm install node-red-contrib-iota-mam
```

# Usage

Two different nodes available for
MAM publish (=upload data to tangle) and MAM fetch (=download data from tangle)

Drag mam function node into a flow and wire it accordingly

a) MAM fetch

an input inject (msg.payload = "your MAM_ROOT") -> mamFetch node -> any output ( e.g. a chart displaying your msg.payload)

Start injecting the payload on the mam function node once and it will
automatically fetch all mam stream data available. To do this click on inputInject function and
change node properties payload to "your MAM_ROOT"
(try with TSC9BIOTHQRDLDDALNNDWWXCSDNBCJJIAW9TRRWDUSWKW9B9AJ9O9BIIWIVDYLKHYPNKHZXTYVL9PIPFJ)
This should hold a temperature sequence. (as of 14 may 2018)

b) MAM publish

input data source (e.g. sensorTag) -> mamPublish node -> (optional) output for logging

The MAM publish gets input data from sensorTag, uploads this data and upon
mam confirmation is ready to take new data from your sensorTag device

TODO - IMPORTANT!!!
Currently the MAM publish function records the ambiant temperature of your
sensorTag. This is very EASY to change and you can upload any sensor data required.
Please checkout source code (mamPublish.js - see gitlab project link attached) to adapt both
functions to your specific node-red sensor device
