import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { voters, candidates } from './Config.js'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            id: ''
        }
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
                    </div>
                </MuiThemeProvider>
            </div>
        );
    }
    handleClick(event) {
        let uid = this.state.name + this.state.id;
        let voter = voters.get(uid);

        if (voter === undefined) {
            console.log("Voter is NOT registered")
            // error message
        } else {
            console.log("Voter is registered")
            // go to page with correct candidates
        }

    }
}

const style = {
    margin: 15,
};

// String.prototype.hashCode = function () {
//     var hash = 0;
//     for (var i = 0; i < this.length; i++) {
//         var character = this.charCodeAt(i);
//         hash = ((hash << 5) - hash) + character;
//         hash = hash & hash; // Convert to 32bit integer
//     }
//     return hash;
// }

export default Login;