class Voter {
    constructor(name, id, bucket) {
        this.name = name;
        this.id = id;
        this.bucket = bucket;
    }

    get fullID() {
        return this.name + this.id;
    }

    get name() {
        return this.name;
    }

    get id() {
        return this.id;
    }

    get bucket() {
        return this.bucket;
    }
}

class Candidate {
    constructor(name, bucket) {
        this.name = name;
        this.bucket = bucket;
    }

    get name() {
        return this.name;
    }

    get bucket() {
        return this.bucket;
    }
}

// String.prototype.hashCode = function() {
//     var hash = 0;
//     for (var i = 0; i < this.length; i++) {
//         var character = this.charCodeAt(i);
//         hash = ((hash<<5)-hash)+character;
//         hash = hash & hash; // Convert to 32bit integer
//     }
//     return hash;
// }

const voters = new Map([
    ["Robert1",     new Voter("Robert", "1", "CSC")],
    ["Andrew2",     new Voter("Andrew", "2", "CSC")],
    ["Patrick3",    new Voter("Patrick", "3", "CSC")],
    ["Conner4",     new Voter("Conner", "4", "CSC")],
    ["Carson5",     new Voter("Carson", "5", "CSC")],
    ["Jatt6",       new Voter("Jatt", "6", "CSC")],
    ["Max7",        new Voter("Max", "7", "CSC")],
    ["Maddie8",     new Voter("Maddie", "8", "CSC")],
    ["Matt9",       new Voter("Matt", "9", "CSC")],
    ["Larry10",     new Voter("Larry", "10", "CSC")],
    ["Harry11",     new Voter("Harry", "11", "CHM")],
    ["Joseph12",    new Voter("Joseph", "12", "CHM")],
    ["Aaron13",     new Voter("Aaron", "13", "CHM")],
    ["Fergie14",    new Voter("Fergie", "14", "CHM")],
    ["Kendrick15",  new Voter("Kendrick", "15", "CHM")],
    ["Kanye16",     new Voter("Kanye", "16", "CHM")],
    ["Jackson17",   new Voter("Jackson", "17", "CHM")]
]);

const candidates = new Set(
    new Candidate("Jerry", "CSC"),
    new Candidate("Fetty", "CSC"),
    new Candidate("Holy", "CHM"),
    new Candidate("Moly", "CHM")
);

export const voters = voters;
export const candidates = candidates;