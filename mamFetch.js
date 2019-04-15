const MAM = require('@iota/mam');
const IOTA_CONVERTER = require('@iota/converter')

module.exports = function(RED) {
    function mamFetch(config) {
        RED.nodes.createNode(this,config);
        var node = this;
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
        let resp = MAM.fetch(root, config.mode, config.secret, null, config.limit);

        resp.then(function(result) {
          console.log("Datasets found");
          console.log("###############################################");
          var json = {payload:"START ROOT = " + root};
          node.send(json);
          console.log(result);
          result.messages.forEach(function(value) {
            console.log(IOTA_CONVERTER.trytesToAscii(value))
          });
          console.log("###############################################");
        });
    }
    RED.nodes.registerType("mamFetch",mamFetch);
}
