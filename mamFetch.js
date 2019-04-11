const MAM = require('@iota/mam');
const IOTA_CONVERTER = require('@iota/converter')

module.exports = function(RED) {
    function mamFetch(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        console.log("MAM fetch on iota node: " + config.iotaNode);
        console.log("MAM root: " + config.root);
        console.log("Fetching data ... ");

        let mamRoot = config.root;
        let mamState = MAM.init({ provider: config.iotaNode })

        let resp = MAM.fetch(mamRoot, 'public', null);

        resp.then(function(result) {
          console.log(result);
          console.log("Datasets found");
          console.log("###############################################");
          var json = {payload:"START ROOT = " + mamRoot};
          node.send(json);
          result.messages.forEach(function(value) {
            console.log(Converter.trytesToAscii(value))
          });
          console.log("###############################################");
        });
    }
    RED.nodes.registerType("mamFetch",mamFetch);
}
