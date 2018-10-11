let TruffleContract = require('truffle-contract');
let Election = require('./build/contracts/Election.json');

let Web3 = require('web3'); // https://www.npmjs.com/package/web3


this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7749')
this.web3 = new Web3(this.web3Provider)

let list = require('./voterList');

this.election = TruffleContract(Election)
this.election.setProvider(this.web3Provider)
this.election.defaults({from: this.web3.eth.accounts[0]});
this.web3.personal.unlockAccount(this.web3.eth.accounts[0],"testing", 15000);

this.election.deployed()
        .then((instance) => {
            // CSC
            for (var i = 0; i < 142; i++) {
                instance.vote(list.voters[i] * 2, list.candidates[0]);
            }
            for (var i = 142; i < 173; i++) {
                instance.vote(list.voters[i] * 2, list.candidates[1]);
            }
            for (var i = 173; i < 192; i++) {
                instance.vote(list.voters[i] * 2, list.candidates[2]);
            }
            for (var i = 192; i < 200; i++) {
                instance.vote(list.voters[i] * 2, list.candidates[3]);
            }

            // CHM
            for (var i = 0; i < 84; i++) {
                instance.vote((list.voters[i] * 2) + 1, list.candidates[4]);
            }
            for (var i = 84; i < 200; i++) {
                instance.vote((list.voters[i] * 2) + 1, list.candidates[5]);
            }
        });
