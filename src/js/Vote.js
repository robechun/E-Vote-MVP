import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import Election from '../../build/contracts/Election.json'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import './../css/index.css';
import CandidateList from './CandidateList';

class Vote extends React.Component {

    constructor(props) {
        console.log("Vote constructor")
        super(props);
        this.state = {
            bucket: this.props.location.state.bucket,
            uid: this.props.location.state.uid,
            validCandidates : []
        }
        
        console.log(this.state.bucket);


        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7749')
        }

        this.web3 = new Web3(this.web3Provider)

        this.election = TruffleContract(Election)
        this.election.setProvider(this.web3Provider)
    }

    componentDidMount() {
        console.log("In Vote yee haw")
        console.log(this.state.bucket);

        this.election.deployed()
        .then((instance) => {
            this.electionInstance = instance;
            return this.electionInstance;
        })
        .then((electionInstance) => electionInstance.candidateCount())
        .then((candidateCount) => {
            // this is a pseudo approach to the problem and not the best.
            // this goes over the candiates in the array.
            let temp = [];
            let newValidCandidates = [];

            for (let i = 0; i < candidateCount; i++) {
                temp.push(this.electionInstance.candidatesInBucket(this.state.bucket,i));
            }
            console.log(temp);

            Promise.all(temp)
            .then(result => {
                let values = result.filter(item => item !== "0x");
                this.setState({validCandidates: values})
            });
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        console.log("rendering...")
        console.log(this.state.validCandidates);
        return (
            <div>
                <MuiThemeProvider>
                    <div>
                        <AppBar title="Vote for a candidate" />
                        <CandidateList candidates={ this.state.validCandidates } uid={ this.state.uid }/>
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }

}

export default withRouter(Vote);