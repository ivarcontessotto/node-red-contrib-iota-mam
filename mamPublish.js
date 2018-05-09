const IOTA = require('iota.lib.js');
// const iota = new IOTA({ provider: 'http://node04.nodeblie.de:14265/ ' })
const iota = new IOTA({ provider: `https://nodes.testnet.iota.org:443/` })
const MAM = require('./mam.node.js');

function mamSeedGen() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";

  for (var i = 0; i < 81; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  console.log('New Channel with following SEED generated: ' + text);
  return text;
}

// channel.publish = async function(packet) {
//     // Create the message.
//     let trytes = iota.utils.toTrytes(JSON.stringify(packet.payload))
//     let message = MAM.create(this._state, trytes);
//
//     // Update the mam state so we can keep adding messages.
//     this._state = message.state;
//
//     console.log('Sending message: ', packet);
//       console.log('Sending message payload: ', packet.payload);
//     console.log('Root: ', message.root);
//     console.log('Address: ', message.address);
//     console.log();
//
//     // Attach the message.
//     var x = await MAM.attach(message.payload, message.address);
//     console.log("OUTPUT MAM: " + x);
//     if (x) {
//       console.log("IOTA MAM OUTPUT");
//       console.log(x);
//     }
//     return message.root
// }

module.exports = function(RED) {
    function mamPublish(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node._sec = 2;
        node._firstroot = '';
        node._state = MAM.init(iota, mamSeedGen(), 2, 0);

        node.on('input', function(msg) {

            let trytes = iota.utils.toTrytes(JSON.stringify(msg.payload))
            let message = MAM.create(this._state, trytes);
            // Update the mam state so we can keep adding messages.
            this._state = message.state;

            console.log("MAM UPLOAD")
            console.log(message)
            let resp = MAM.attach(message.payload, message.address);
            resp.then(function(result) {
               console.log(result) //will log results.
            });
        });
    }
    RED.nodes.registerType("mamPublish",mamPublish);
}
