# Node-red IOTA MAM module

## Requirements

Install node-red globally and install ui packages and the sensortag package

```
sudo npm install -g --unsafe-perm node-red
```

in your ~/.node-red installation directory type:
```
npm install node-red-dashboard node-red-contrib-sensortag
```

# IOTA-MAM module installation

Run the following command in your NODE-RED install
```
npm install node-red-contrib-iota-mam
```

# Usage

Two different function nodes are now available for

**MAM publish** (=upload data to tangle)
and
**MAM fetch** (=download data from tangle)

Drag MAM function node into a flow and wire it accordingly


## MAM fetch

Start deploying a single 'input inject'.
Set its msg.payload (**msg.payload = "your MAM_ROOT"**)

wire its output to
-> mamFetch node

and wire this node's output to
-> any output ( e.g. a chart displaying your msg.payload)

Start injecting the payload on the mam function node once and it will
automatically fetch all MAM stream data available.

> try with TSC9BIOTHQRDLDDALNNDWWXCSDNBCJJIAW9TRRWDUSWKW9B9AJ9O9BIIWIVDYLKHYPNKHZXTYVL9PIPFJ)

This should hold a temperature sequence. (as of 14 may 2018)


## MAM publish

Deploy a sensorTag as input data source.

wire its output to
-> mamPublish node

and wire this node's output to an
-> (optional) output for logging

The MAM publish gets input data from sensorTag, uploads this data and upon
MAM confirmation is ready to take new data from your sensorTag device.


# *TODO - IMPORTANT!!!*
*Currently the MAM publish function records the ambiant temperature of your
sensorTag. This is very EASY to change and you can upload any sensor data required.
Please checkout source code (mamPublish.js - see gitlab project link attached) to adapt both
functions to your specific node-red sensor device.*
