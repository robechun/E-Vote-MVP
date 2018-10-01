import React from 'react'
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import Election from '../../build/contracts/Election.json';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class ResultTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates : new Map()
        }

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7749')
        }

        this.web3 = new Web3(this.web3Provider)

        this.election = TruffleContract(Election)
        this.election.setProvider(this.web3Provider)

        this.election.deployed()
        .then((instance) => {
            this.electionInstance = instance;
            return this.electionInstance;
        })
        .then(electionInstance => electionInstance.candidateCount())
        .then(candidateCount => {
            let promiseNames = [];

            for (var i = 0; i < candidateCount; i++) {
                promiseNames.push(this.electionInstance.candidates(i));
            }

            let tempMap = new Map();

            Promise.all(promiseNames)
            .then(result => {
                // Resolves candidate names from promise.
                // Uses these names to get candidateInformation with Promise.
                // Returns the list of promises.

                let promiseCandInfo = result.map(name => this.electionInstance.candidateTable(name.substring(0,32)));

                return promiseCandInfo
            })
            .then(promiseCandInfo => {
                // Waits to resolve candidate Information (Candidate Struct -- aka array)
                Promise.all(promiseCandInfo)
                .then(candidateInfo => {
                    // candidateInfo is array of array.
                    // console.log("candidateInfo:")
                    // console.log(candidateInfo)
                    candidateInfo.map(cand => {
                        // console.log("candidate is: ")
                        // console.log(cand);

                        if (tempMap.get(cand[1]) === undefined) {
                            // Mapping of this candidate doesn't exist yet.
                            // console.log("Making new bucket")
                            tempMap.set(cand[1], new Array());
                        }
                        // Add candidate 
                        // console.log("Adding to bucket")
                        // console.log(cand[2]);
                        
                        tempMap.get(cand[1]).push({name: this.web3.toAscii(cand[0]), votes: cand[2].toNumber()})
                        // console.log("hello");
                        // console.log(tempMap);
                    })

                    // console.log("before set state")
                    // console.log(tempMap);
                    this.setState({ candidates: tempMap });
                })
            })
        })


        // .then(candidateCount => {
        //     let tempMap = new Map();

        //     for (var i = 0; i < candidateCount; i++) {
        //         this.electionInstance.candidates(i)
        //         .then(candidateName => {
        //             this.tempName = candidateName;
        //             this.electionInstance.candidateTable(candidateName)
        //             .then(candidateInfo => {
        //                 if (tempMap.get(candidateInfo[1]) === undefined) {
        //                     console.log("Making new bucket")
        //                     tempMap.set(candidateInfo[1], new Array());
        //                 }
        //                 console.log("Adding to bucket")
        //                 console.log(candidateInfo[2]);
                        
        //                 tempMap.get(candidateInfo[1]).push({name: this.web3.toAscii(candidateInfo[0]), votes: candidateInfo[2]})
        //                 console.log("hello");
        //                 console.log(tempMap);
        //             })
        //         })
        //     }

        //     return tempMap;

        //     // console.log(tempMap);
        // })
        // .then(tempMap => this.setState({ candiates: tempMap }));
    }

    render() {
        console.log("Rendering ResultTable");
        console.log(this.state.candidates);

        let it = this.state.candidates.keys();
        var res = it.next();
        let buckets = [];

        while (!res.done) {
            buckets.push(res.value);
            res = it.next();
        }

        // console.log("buckets:")
        // console.log(buckets)
        return (
            <div>
            {buckets.map(bucket => {
                // console.log("Inside react 1")
                return (
                    <Paper className={ bucket }>
                        <Toolbar>
                          <Typography variant="title" id="tableTitle">
                            { this.web3.toAscii(bucket) }
                          </Typography>
                        </Toolbar>
                        <Table className={ bucket + "Table" }>
                            <TableHead>
                            <TableRow>
                                <TableCell>Candidate</TableCell>
                                <TableCell numeric>Votes</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                { this.state.candidates.get(bucket).map(row => {
                                    // console.log("Inside react 2")
                                    return (
                                        <TableRow >
                                            <TableCell component="th" scope="row">{row.name}</TableCell>
                                            <TableCell numeric>{row.votes}</TableCell>
                                        </TableRow>
                                    )
                                }) }
                            </TableBody>
                        </Table>
                    </Paper>
                )
            })}
            </div>

            // <Paper className="topPaper">
            //     <Table className="topTable">
            //         <TableHead>
            //         <TableRow>
            //             <TableCell>Candidate</TableCell>
            //             <TableCell numeric>Votes</TableCell>
            //         </TableRow>
            //         </TableHead>
            //         <TableBody>
            //             {this.state.candidates.map(row => {
            //                 return (
            //                     <TableRow >
            //                         <TableCell component="th" scope="row">{row.name}</TableCell>
            //                         <TableCell numeric>{row.votes}</TableCell>
            //                     </TableRow>
            //                 )
            //             })}
            //         </TableBody>
            //     </Table>
            // </Paper>
        )

    }

}

export default ResultTable;