const MAM = require('@iota/mam');
const IOTA_CONVERTER = require('@iota/converter');

module.exports = function(RED) {
    function mamPublish(config) {
        try {
            RED.nodes.createNode(this, config);
            var node = this;
            this.log(`Init on iota node: ${config.iotaNode}`);
            node._state = MAM.init({ provider: config.iotaNode });
            node._state = MAM.changeMode(node._state, config.mode, config.secretKey);
            node.readyMAM = true;
            node.arrayPackets = []
        }
        catch(err) {
            this.error(`Error Init on iota node: ${err}`);
            return;
        }

        node.on('input', function(msg) {
            try {
                const packet = { time: Date.now(), data: msg.payload };
                this.arrayPackets.push(packet);
                this.log(`Packet Buffer Length: ${this.arrayPackets.length}`);

                if (this.readyMAM) {
                    this.log('Last MAM message is confirmed. Publishing new message now.')

                    let trytes = IOTA_CONVERTER.asciiToTrytes(JSON.stringify(this.arrayPackets));
                    let message = MAM.create(this._state, trytes);

                    // Update the mam state so we can keep adding messages.
                    this._state = message.state;

                    this.log('Uploading dataset via MAM - please wait');
                    this.log(`Root Address: ${message.address}`);
                    let resp = MAM.attach(message.payload, message.address);

                    this.readyMAM = false;
                    this.arrayPackets = [];

                    resp.then(result => {
                        this.log('Received response for attaching last message. Confirmed Transactions:');
                        for (let i = 0; i < result.length; i++) {
                            this.log(`Transaction Hash: ${result[i].hash}`);
                        }
                        node.readyMAM = true;
                        node.send({payload: message.address});
                    }).catch(err => {
                        node.readyMAM = true;
                        this.error(`Error uploading dataset via MAM: ${err}`);
                    });
                }
                else {
                    this.log('Last MAM message not confirmed yet. Only collecting packet for next message.');
                }
             }
             catch(err) {
                this.error(`Error handling node input: ${err}`);
             }
        });
    }
    RED.nodes.registerType("mamPublish",mamPublish);
}
