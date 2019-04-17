const MAM = require('@iota/mam');
const IOTA_CONVERTER = require('@iota/converter');

module.exports = function(RED) {
    function mamPublish(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        console.log("MAM publish INIT on iota node: " + config.iotaNode);
        node._state = MAM.init({ provider: config.iotaNode });
        node._state = MAM.changeMode(node._state, config.mode, config.secretKey);
        node.readyMAM = true;
        node.arrayPackets = []

        node.on('input', function(msg) {
            // upload sensorTag's data packet: (msg.payload.json_data)
            const packet = { time: Date.now(), data: msg.payload.json_data };
            this.arrayPackets.push(packet);
            console.log(this.arrayPackets.length);

            if (this.readyMAM) {
              let trytes = IOTA_CONVERTER.asciiToTrytes(JSON.stringify(this.arrayPackets));
              let message = MAM.create(this._state, trytes);
              // Update the mam state so we can keep adding messages.
              this._state = message.state;

              console.log("Uploading dataset via MAM - please wait");
              console.log(message.address);
              let resp = MAM.attach(message.payload, message.address);
              this.readyMAM = false;
              this.arrayPackets = [];
              resp.then(function(result) {
                 console.log(result) //will log results.
                 node.readyMAM = true;
                 node.send({payload: message.address});
              });
            } else {

            }
        });
    }
    RED.nodes.registerType("mamPublish",mamPublish);
}
