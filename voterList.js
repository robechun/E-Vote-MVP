var _candidates = ["Robert", "Carlos", "Hannah", "Conner", "Andrew", "Stephanie"];
var _candidateBuckets = ["CSC", "CSC", "CSC", "CSC", "CHM", "CHM"];

var _voters = [];
var _voterBucket = [];
var cur = "a";
for (var i = 0; i < 400; i++) {
    var charCode = 65 + (i % 26)
    if (i % 26 == 0) {
        cur = cur.concat("a");
    }

    _voters.push(cur.concat(String.fromCharCode(charCode)));
}

for (var i = 0; i < 200; i++) {
    _voterBucket.push("CSC");
    _voterBucket.push("CHM");
}

let Web3 = require('web3'); // https://www.npmjs.com/package/web3
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:7749'));


var voters = _voters.map(voter => web3.fromAscii(voter).substring(0,32))
var voterBucket = _voterBucket.map(bucket => web3.fromAscii(bucket).substring(0,32));
var candidates = _candidates.map(cand => web3.fromAscii(cand).substring(0,32));
var candidateBuckets = _candidateBuckets.map(bucket => web3.fromAscii(bucket).substring(0,32));

module.exports = {
    voters,
    voterBucket,
    candidates,
    candidateBuckets
}
