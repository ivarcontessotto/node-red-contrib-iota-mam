const MAM = require('@iota/mam');
const IOTA_CONVERTER = require('@iota/converter')

module.exports = function(RED) {
    function mamFetch(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', function(msg) {
          config.root = msg.payload;

          console.log("MAM fetch on iota node: " + config.iotaNode);
          console.log("MAM root: " + config.root);
          console.log("MAM mode: " + config.mode);
          console.log("MAM secret: " + config.secret);
          console.log("Fetching data ... ");

          let mamState = MAM.init({ provider: config.iotaNode });
          let root = config.root.slice(0,81);
          if (config.mode == 'restricted' && config.secret.length == 0) {
            console.log("Restricted mode: No MAM secret selected");
          }
          if (config.mode == 'public') {
            config.secret = null;
          }
          let resp = MAM.fetch(root, config.mode, config.secret, (result) => {
            node.send(JSON.parse(IOTA_CONVERTER.trytesToAscii(result)));
            console.log(IOTA_CONVERTER.trytesToAscii(result))
          }, config.limit);
        });
    }
    RED.nodes.registerType("mamFetch",mamFetch);
}
