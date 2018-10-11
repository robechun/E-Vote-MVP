import React from 'react';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import Election from '../../build/contracts/Election.json';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import ResultTable from './ResultTable';

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            close: false
        }

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7749')
        }

        this.web3 = new Web3(this.web3Provider)

        this.election = TruffleContract(Election)
        this.election.setProvider(this.web3Provider)
        this.election.defaults({from: this.web3.eth.accounts[0]});
        this.web3.personal.unlockAccount(this.web3.eth.accounts[0],"testing", 15000); // todo wont work with close
    }

    handleClose = (event) => {
        // close the election.
        this.election.deployed()
        .then((instance) => {
            this.electionInstance = instance;
            return this.electionInstance;
        })
        .then(electionInstance => electionInstance.closeElection())
        .then(() => {
            this.electionInstance.closed()
            .then(closed => {
                if (closed) {
                    this.setState({ close: true });
                } else {
                    alert("Closing election failed");
                }
            })
        })
        .catch(err => console.log(err.message));
    }

    render() {
        if (this.state.close === true) {
            return (
                <div>
                    <MuiThemeProvider>
                        <div>
                            <AppBar title="Results" />
                            <ResultTable />
                        </div>
                    </MuiThemeProvider>
                </div>
            )
        }
        else {
            return (
                <div>
                    <MuiThemeProvider>
                        <div>
                            <AppBar title="Closing Election" />
                            <RaisedButton label="Close Election" primary={true} style={style} onClick={(event) => this.handleClose(event)} />
                        </div>
                    </MuiThemeProvider>
                </div>
            )
        }
    }
}

const style = {
    margin: 15,
};

export default Results;