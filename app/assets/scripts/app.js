'use strict'
import React from 'react'
import c from 'classnames'
import Header from './components/header'
import Map from './components/map'
import Timeline from './components/timeline'
import About from './components/about'

import { Link } from 'react-router'

class MainContent extends React.Component {
  constructor () {
    super()
    this.state = {
      view: 'overview',
      year: 2013
    }
    this.setView = this.setView.bind(this)
    this.setView2 = this.setView2.bind(this)
    this.setView3 = this.setView3.bind(this)
    this.setView4 = this.setView4.bind(this)
    this.setView5 = this.setView5.bind(this)
    this.setView6 = this.setView6.bind(this)
    this.setView7 = this.setView7.bind(this)
  }

  setSet (waffle) {
    this.setState({
      view: waffle
    })
  }

  setView () {
    this.setSet('overview')
  }
  setView2 () {
    this.setSet('prohibit')
  }
  setView3 () {
    this.setSet('counseling')
  }
  setView4 () {
    this.setSet('waiting')
  }
  setView5 () {
    this.setSet('parent')
  }
  setView6 () {
    this.setSet('ultra')
  }
  setView7 () {
    this.setSet('crisis')
  }

  render () {
    return (
      <div>
      <Header />

      <div className='welcome'>
        <p className='welcome__text'>Since the landmark Supreme Court decision Roe v. Wade in 1973, which legalized abortion throughout in the U.S., states across the country have slowly chipped away at this federally protected right. We are here to tell this story.</p>
      </div>

      <div className='sidebar__back'>
      </div>
      <section className='sidebar'>
        <ul>
          <Link to='/overview'><li className={c('sidebar__option', {'sidebar__option--active': this.state.view === 'overview'})} onClick={this.setView} >Overall Score</li></Link>
          <Link to='/prohibit'><li className={c('sidebar__option', {'sidebar__option--active': this.state.view === 'prohibit'})} onClick={this.setView2} >Prohibited At</li></Link>
          <Link to='/counseling'><li className={c('sidebar__option', {'sidebar__option--active': this.state.view === 'counseling'})} onClick={this.setView3} >Mandated Consoluing</li></Link>
          <Link to='/waiting'><li className={c('sidebar__option', {'sidebar__option--active': this.state.view === 'waiting'})} onClick={this.setView4} >Waiting Period</li></Link>
          <Link to='/parent'><li className={c('sidebar__option', {'sidebar__option--active': this.state.view === 'parent'})} onClick={this.setView5} >Parental Consent</li></Link>
          <Link to='/ultra'><li className={c('sidebar__option', {'sidebar__option--active': this.state.view === 'ultra'})} onClick={this.setView6} >Mandatory Ultrasound</li></Link>
          <Link to='/crisis'><li className={c('sidebar__option', {'sidebar__option--active': this.state.view === 'crisis'})} onClick={this.setView7} >Crisis Pregnancy Centers</li></Link>
        </ul>
      </section>

      <div className='top-content'>
        <Map view={this.state.view} year={this.state.year} />
      </div>

      <section className='Timeline-info'>
        <Timeline />
      </section>

      {/* add this */}
      {this.props.children}

      <section className='About'>
        <About />
      </section>

    </div>
    )
  }
}

module.exports = MainContent
