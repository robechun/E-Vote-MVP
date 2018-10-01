import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import Election from '../../build/contracts/Election.json';
import RaisedButton from 'material-ui/RaisedButton';

class CandidateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            candidates: this.props.candidates,
            uid: this.props.uid,
        };

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7749')
        }

        this.web3 = new Web3(this.web3Provider)

        this.election = TruffleContract(Election)
        this.election.setProvider(this.web3Provider)
        this.election.defaults({from: this.web3.eth.accounts[1]});
        this.web3.personal.unlockAccount(this.web3.eth.accounts[1],"testing", 15000);

        // this.web3.eth.defaultAccount = this.web3.eth.accounts[0];
        
        console.log("In candidateList");
        console.log(this.state.candidates);
    }
    
    
    handleListItemClick = (event, index) => {
        this.setState({ selectedIndex: index });
    };

    componentWillReceiveProps(nextProps) {
        console.log("Component received next props");
        console.log(nextProps.candidates);
        this.setState({ candidates: nextProps.candidates })
    }

    handleSubmit = (event) => {
        this.election.deployed()
        .then((instance) => {
            this.electionInstance = instance;
            return this.electionInstance;
        })
        .then(electionInstance => {
            console.log(this.state.uid);
            console.log(this.state.candidates[this.state.selectedIndex].substring(0,32));

            return electionInstance.voterData(this.state.uid)
        })
        .then(voterData => {
            if (voterData[0] === true) {
                console.log(voterData[0]);
                alert("Voter already voted")
            } else {
                this.electionInstance.vote(this.state.uid, 
                    this.state.candidates[this.state.selectedIndex].substring(0,32)
                ).then(result => {
                    console.log("Result of vote:")
                    console.log(result);
                    alert("Voted!")
                });;
            }
        })
        .catch(err => console.log(err.message));

    }

    render() {
        console.log("rendering candidateList");
        console.log(this.state.candidates);

        const candidateListItems = this.state.candidates.map((name, index) => {
            console.log("name: " + name + " index: " + index);
            return (
                <div>
                    <ListItem
                        button
                        selected={this.state.selectedIndex === index}
                        onClick={event => this.handleListItemClick(event, index)}
                    >
                        <ListItemText primary={this.web3.toAscii(name)} />
                    </ListItem>
                </div>
            );
        });

        return (
            <div className="candidateList">
                <List component="nav">
                    { candidateListItems }
                </List>
                <br />
                <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleSubmit(event)} />
            </div>
        )
    }

}

const style = {
    margin: 15,
};


export default CandidateList


// TODO: mgiht want to wait for async call of getting candidates in bucket before rendering this (aka do async/await in Vote.js)