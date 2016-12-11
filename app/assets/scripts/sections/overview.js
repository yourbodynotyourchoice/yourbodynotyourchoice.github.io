'use strict'
import React from 'react'

class Overview extends React.Component {

  render () {
    return (
      <div className='analaysis__content'>
        <h2>Overall Grade</h2>
        <p>We present grades as devised by <a href='http://www.naral.org/'>NARAL</a>, which are based on each state's policies regarding a woman's choice and access to abortions. Most of the failing grades come from states which boast one or more of the restrictive laws discussed here while an “A” grade required laws which instead protected or further ensured choice and access.</p>
        <p>We've taken the liberty of dropping the “+” and “-” from their grades for the sake of clarity.</p>
        <p><a href='More information on the methodology can be found at NARAL’s website.'>More information on the methodology can be found at NARAL’s website.</a></p>
      </div>
    )
  }
}

module.exports = Overview
