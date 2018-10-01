import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './Login'
import Vote  from './Vote'
import Results from './Results'

ReactDOM.render((
  <BrowserRouter >
    <Switch>
      <Route path="/dist" exact={true} component={ Login }/>
      <Route path="/dist/vote" component={ Vote }/>
      <Route path="/dist/results" component={ Results }/>
      <Route render={() => { return <h1>Fallthrough</h1> }} />
    </Switch>
  </BrowserRouter>
), document.querySelector('#root'))
