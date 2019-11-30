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
            node.arrayPackets = [];
            node.pendingMessage = null;
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
                    this.log('MAM ready so send message.')

                    // If last message could be sent successfully we create a new one. Else we retry sending the last one.
                    if (!this.pendingMessage) {
                        let trytes = IOTA_CONVERTER.asciiToTrytes(JSON.stringify(this.arrayPackets));
                        this.pendingMessage = MAM.create(this._state, trytes);
                        this.arrayPackets = []; // Clear packet buffer
                        this._state = this.pendingMessage.state; // Update state for the next message.
                    }

                    this.log('Uploading message to MAM Stream - please wait');
                    this.log(`Address: ${this.pendingMessage.address}`);
                    let response = MAM.attach(this.pendingMessage.payload, this.pendingMessage.address);
                    this.readyMAM = false;

                    response.then(result => {
                        this.log('Received response for attaching last message. Confirmed Transactions:');
                        for (let i = 0; i < result.length; i++) {
                            this.log(`Transaction Hash: ${result[i].hash}`);
                        }

                        if (result.length > 0) {
                            // Go to next state when sure transactions have been attached.
                            node.send({payload: this.pendingMessage.address});
                            this.pendingMessage = null; // Delete pending message to signal that a new one can be sent.
                        }
                        node.readyMAM = true;

                    }).catch(err => {
                        this.error(`Error uploading dataset via MAM: ${err}`);
                        node.readyMAM = true;
                    });
                }
                else {
                    this.log('MAM not ready yet. Collecting packet for next message.');
                }
             }
             catch(err) {
                this.error(`Error handling node input: ${err}`);
             }
        });
    }
    RED.nodes.registerType("mamPublish",mamPublish);
}
