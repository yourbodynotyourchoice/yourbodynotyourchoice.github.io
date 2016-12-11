'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import MainContent from './app'

import { Router, Route, hashHistory } from 'react-router'
import Overview from './sections/overview'
import Prohibit from './sections/prohibit'
import Consoluing from './sections/consoluing'
import Waiting from './sections/waiting'
import Parent from './sections/parent'
import Ultra from './sections/ultra'
import Crisis from './sections/crisis'

import config from './config'

console.log.apply(console, config.consoleMessage)
console.log('Environment', config.environment)

const app = document.createElement('div')
document.body.appendChild(app)

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      view: 'overview'
    }
  }

  render () {
    return <div id='app' style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <Router history={hashHistory}>
        <section className='Analysis'>
          <Route path='/' component={MainContent}>
            {/* make them children of `App` */}
            <Route path='/overview' component={Overview}/>
            <Route path='/prohibit' component={Prohibit}/>
            <Route path='/consoluing' component={Consoluing}/>
            <Route path='/waiting' component={Waiting}/>
            <Route path='/parent' component={Parent}/>
            <Route path='/ultra' component={Ultra}/>
            <Route path='/crisis' component={Crisis}/>
          </Route>
        </section>
      </Router>
    </div>
  }
}

ReactDOM.render(<App />, app)
