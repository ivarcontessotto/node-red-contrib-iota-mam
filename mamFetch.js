const IOTA = require('iota.lib.js');
// const iota = new IOTA({ provider: 'http://node04.nodeblie.de:14265/ ' })
const iota = new IOTA({ provider: `https://nodes.testnet.iota.org:443/` })

const MAM = require('./mam.node.js');

module.exports = function(RED) {
    function mamFetch(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        let mamState = MAM.init(iota)

        // trigger for mam update
        // some random msg input
        node.on('input', function(msg) {
            // msg.payload = msg.payload.toLowerCase();
            // node.send(msg);
            var self = this;
            console.log(msg)
            // let rootVal = "TSC9BIOTHQRDLDDALNNDWWXCSDNBCJJIAW9TRRWDUSWKW9B9AJ9O9BIIWIVDYLKHYPNKHZXTYVL9PIPFJ"
            let resp = MAM.fetch(msg.payload, 'public', null, function(data) {
        				let json = JSON.parse(iota.utils.fromTrytes(data));
                msg.payload = JSON.stringify(json);
                console.log("console "+ msg.payload)
                self.send(msg);
        		});
        });
    }
    RED.nodes.registerType("mamFetch",mamFetch);
}
