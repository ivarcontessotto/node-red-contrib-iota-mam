# Node-red IOTA MAM module

Updated on 11/04/2019

## Requirements

Install node-red globally and install ui packages and the sensortag package

```
sudo npm install -g --unsafe-perm node-red
```

in your ~/.node-red installation directory type:
```
npm install node-red-dashboard node-red-contrib-sensortag node-red-contrib-simple-gate

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

## CONFIG - At first use a Node-red sample file !!!

Find included in root directory a flow sample file called flows_Air.json
It provides you with an initial value config for ROOT (mamFetch) and a devnet IOTA node.

If you have any issues regarding this module, please test with this file and give a clear issue description. Thank you!

## MAM fetch

Start deploying a single 'mamFetch function node'.
Set its root property (**root = "your MAM_ROOT"**)

wire this node's output to
-> any output ( e.g. a chart displaying your msg.payload)

> try with EIJVGVYZXEYGMG9PUFVPTSMHICLHYWOEHWUTOGPCXWEHIOSRP9WUTCQGEBZLFXFUTEWUMTUAQLCEOLQPV)

This should hold a temperature sequence. (as of 30 may 2018)


## MAM publish

Deploy a sensorTag as input data source.

wire its output to
-> mamPublish node

and wire this node's output to an
-> (optional) output for logging

The MAM publish gets input data from sensorTag, uploads the data packet it receives (can be a mix of temperature, lux etc) and upon MAM confirmation is ready to take new data from your sensorTag device.
