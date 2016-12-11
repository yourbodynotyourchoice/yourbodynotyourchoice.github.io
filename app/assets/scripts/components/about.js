'use strict'
import React from 'react'

class About extends React.Component {

  render () {
    return (
      <div className='about__content'>
        <h2 className='about__content--header'>About this Map</h2>
        <div className='about__content--linebreak'></div>
        <h2>Data</h2>
        <p>Most of the locations of abortion providers in the U.S. are from Planned Parenthood and the National Abortion Federation (NAF). Only those Planned Parenthoods that offer abortion services were included in the map. These locations were cross-checked with NAF's data to ensure that there were no duplicates. A few abortion providers are from GynPages and abortionclinicpages.com. We know that this is not a comprehensive list of abortion providers in the U.S., as a report from the Guttmacher Institute found that there were an estimated 1,720 abortion providers in the U.S. in 2011 (as opposed to the 607 abortion providers included in our map). However, we could not compile a complete list, as the Guttmacher Institute does not release this information due to confidentiality agreements with many providers. We believe that much of the discrepancy between our number and the complete number is due to hospitals and private physicians' offices that do not belong to the National Abortion Federation. If you have any leads on where we can get a complete list of abortion providers, please contact us.</p>
        <p>The locations of crisis pregnancy centers (CPCs) come from Birthright International and Heartbeat International networks. Care-Net also has an extensive network of CPCs but does not have a comprehensive list of their affiliates.</p>
        <p>This website is not intended to help women seeking an abortion find medical care. If you are a pregnant woman in need of medical attention or are seeking an abortion provider, please ask your doctor or go to Planned Parenthood's or National Abortion Federation's websites to look for your nearest abortion provider.</p>
        <p>The maps drawn are all projected in USA Contiguous Albers Equal Area Conic except for "Distance to nearest Abortion Provider" which is projected in USA Contiguous Equidistant Conic to preserve distance.</p>

        <h2>Authors + Contact</h2>
        <p>Your Body, (Not) Your Choice is a collaboration project by Katie Kowalsky, Dylan Moriarty, and Robin Tolochko for Robert Roth and Carl Sack’s Interactive Cartography & Geovisualization course at UW-Madison. Completed in December 2014.</p>

        <p>Many thanks to Robert Roth, Carl Sack, Rashauna Mead, Sam Matthews, John Czaplewski, Brian Davidson, Garrick Jannene, Jerry Tolochko, and the UW-Cartography Lab for their invaluable help! This project was inspired by 50 Years of Change, created by Rashauna Mead, Erin Hamilton, and Vanessa Knoppke-Wetzel.</p>

        <p>This project was built with D3, Queue, jQuery, jQuery Timer and Bootstrap.</p>

        <p>If you find any errors in our data or just have general feedback, please contact us.</p>

        <h2>Process</h2>
        <p>All of the code for this project is available on GitHub, here.</p>
        <p>You can read about our processes on our various blog posts: Dylan, Katie, and Robin.</p>
      </div>
    )
  }
}

module.exports = About
