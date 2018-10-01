import React from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Election from '../../build/contracts/Election.json'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './../css/index.css'
import { withRouter, Link } from 'react-router-dom'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            voters: new Set(),
            name: '',
            id: '',
            closed: false
        }

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7749')
        }

        this.web3 = new Web3(this.web3Provider)

        if (this.web3 === null) {
            console.log("web3 is null");
        } else {
            console.log(this.web3);
            console.log(this.web3.version.api);
            console.log(this.web3.eth.accounts);
        }

        this.election = TruffleContract(Election)
        this.election.setProvider(this.web3Provider)

        this.handleClick.bind(this);
    }

    componentDidMount() {
        console.log("In Login componentDidMount");
        // Gets list of voters who can vote & saves it in the state.
        this.election.deployed()
            .then((instance) => {
                this.electionInstance = instance;

                return this.electionInstance;
            })
            .then((electionInstance) => electionInstance.voterCount())
            .then((voterCount) => {
                const tempVoters = new Set();

                for (var i = 0; i < voterCount; i++) {
                    this.electionInstance.voters(i)
                    .then((voter) => tempVoters.add(voter.substring(0,32)));
                }

                this.setState({voters: tempVoters});
                console.log(tempVoters);
            })
            .catch((err) => console.log(err.message));

        this.election.deployed()
            .then(instance => instance.closed())
            .then(res => this.setState({ closed: res }))

    }

    render() {
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar title="Login To Vote" />
                        <TextField
                            hintText="Enter your Name"
                            floatingLabelText="Name"
                            onChange={(event, newValue) => this.setState({ name: newValue })}
                        />
                        <br />
                        <TextField
                            type="password"
                            hintText="Enter your ID"
                            floatingLabelText="ID"
                            onChange={(event, newValue) => this.setState({ id: newValue })}
                        />
                        <br />
                        <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
                        <br />
                        <h5>Admin? Click <Link to='results/'>Here</Link></h5>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }

    handleClick(event) {
        let uid = this.state.name + this.state.id;
        let formattedUID = this.web3.padRight(this.web3.fromAscii(this.state.name + this.state.id), 32);
        console.log(uid);
        console.log(formattedUID);
        console.log(typeof(this.state.voters));
        console.log(typeof(formattedUID));

        if (this.state.closed) {
            alert("Election is closed")
        } else if (this.state.voters.has(formattedUID) === true) {
            console.log("Voter is registered")

            // Get voter bucket and save to a state.
            this.election.deployed()
            .then((instance) => {
                this.electionInstance = instance;
                return this.electionInstance;
            })
            .then((electionInstance) => electionInstance.voterData(uid))
            .then((voterData) => {
                console.log("before push");
                
                this.props.history.push({
                    pathname: '/dist/vote',    
                    state: { 
                        bucket: voterData[1].substring(0,32), 
                        uid: formattedUID
                    }
                })
            })
            .catch((err) => console.log(err.message));
            // this.props.history.push('/dist/vote');

            console.log("done with handleClick!!!");
        } else {
            console.log("Voter is NOT registered")
        }
    }
}
const style = {
    margin: 15,
};

export default withRouter(Login)