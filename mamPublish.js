const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'http://node04.nodeblie.de:14265/ ' })
// const iota = new IOTA({ provider: `https://nodes.testnet.iota.org:443/` })
const MAM = require('./mam.node.js');

function mamSeedGen() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9";

  for (var i = 0; i < 81; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  console.log('New Channel with following SEED generated: ' + text);
  return text;
}

module.exports = function(RED) {
    function mamPublish(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node._sec = 2;
        node._firstroot = '';
        node._state = MAM.init(iota, mamSeedGen(), 2, 0);
        node.readyMAM = true;

        node.on('input', function(msg) {
            if (this.readyMAM) {
              let trytes = iota.utils.toTrytes(JSON.stringify(msg.payload))
              let message = MAM.create(this._state, trytes);
              // Update the mam state so we can keep adding messages.
              this._state = message.state;

              console.log("MAM UPLOAD")
              console.log(message.address)
              let resp = MAM.attach(message.payload, message.address);
              this.readyMAM = false;
              var self = this;
              resp.then(function(result) {
                 console.log("###############################################")
                 console.log("###############################################")
                 console.log("###############################################")
                 console.log(result) //will log results.
                 self.readyMAM = true;
              });
            }
        });
    }
    RED.nodes.registerType("mamPublish",mamPublish);
}
