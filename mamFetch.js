const MAM = require('@iota/mam');

module.exports = function(RED) {
    function mamFetch(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        console.log("MAM fetch on iota node: " + config.iotaNode);
        console.log("MAM root: " + config.root);
        console.log("Fetching data ... ");

        let mamRoot = config.root;
        let mamState = MAM.init({ provider: config.iotaNode })
        console.log(MAM);

        let resp = MAM.fetch(mamRoot, 'public', null);

        resp.then(function(result) {
          console.log(result);
          console.log("Datasets found");
          console.log("###############################################");
          var json = {payload:"START ROOT = " + mamRoot};
          node.send(json);
          result.messages.forEach(function(result) {
            // console.log(iota.utils.fromTrytes(result));
            console.log(JSON.parse(iota.utils.fromTrytes(result)));
          });
          console.log("###############################################");
        });
    }
    RED.nodes.registerType("mamFetch",mamFetch);
}
