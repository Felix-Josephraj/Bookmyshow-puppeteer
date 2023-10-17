import call, { dial } from './call.js'
import puppeteer from 'puppeteer'
import express from 'express'
import mongoose from 'mongoose'
import twilio from 'twilio'

// const puppeteer = require('puppeteer')
// const express = require('express')
const app = express()

// connecting to mongoose
// mongoose.set('strictQuery', false)
// mongoose.connect('mongodb+srv://felixanderson500:Life1998@atlascluster.2rtpa.mongodb.net/toDoListDB', {
//   useNewUrlParser: true,
// })

const itemSchema = {
  name: String,
  url: String,
}
// const Item = mongoose.model('Item', itemSchema)

const bot = async (url) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
  })
  try {
    const page = await browser.newPage()
    await page.goto(
      // url
      // 'https://in.bookmyshow.com/trichy/cinemas/la-cinema-maris-complex-rgb-laser-trichy/LATG/20230119'
      // 'https://in.bookmyshow.com/buytickets/varisu-trichy/movie-tric-ET00332034-MT/20230127'
      // 'https://in.bookmyshow.com/buytickets/irugapatru-trichy/movie-tric-ET00370448-MT/20231012'
      // 'https://in.bookmyshow.com/buytickets/the-road-trichy/movie-tric-ET00371295-MT/20231013'
      'https://in.bookmyshow.com/buytickets/leo-trichy/movie-tric-ET00351731-MT/20231019',
      // 'https://in.bookmyshow.com/buytickets/m3gan-bangalore/movie-bang-ET00343701-MT/20230118'
      //  'https://in.bookmyshow.com/buytickets/<movie>-trichy/movie-tric-<movie id>-MT/<date>'
      //                                                                                yyyymmdd
      { waitUntil: 'load' }
    )

    /* Run javascript inside the page */
    try {
      const data = await page.evaluate(() => {
        const list = []
        const bookingDate = document
          ?.querySelector('div.slick-track')
          ?.querySelector('li.slick-active')
          ?.querySelector('.date-numeric').innerHTML
        console.log(bookingDate)
        const items = document.querySelector('#venuelist')?.querySelectorAll('li.list')
        items?.forEach((item) => {
          list.push(item.querySelector('a.__venue-name').innerHTML)
        })
        return [list, bookingDate]
      })
      // console.log('at', data)
      const excludedTheatres = [
        'sona',
        'maris',
        'ramba',
        // 'star',
        // 'bhelec',
        // 'jothi',
        'megastar',
        // 'venkatesa',
        // 'mariyam',
        // 'cauvery',
        // 'saroja',
        // 'shanthi',
        'moorthys',
      ]
      const [theatres, bookingDate] = data

      // Booking date need to be mentioned
      if (bookingDate?.trim() == '19') {
        theatres?.forEach((theatre) => {
          const triggerCall = excludedTheatres.every((exludeTheatre) => {
            const excludeTheatrePattern = new RegExp(exludeTheatre, 'gim')
            if (!theatre.match(excludeTheatrePattern)) return true
            else return false
          })
          if (triggerCall) {
            console.log('trigger')
            alreadyTriggered = true
            // ********
            const accountSid = 'AC02b5548290e23eed6ab1cc6e992883dc'
            // const authToken = process.env.TWILIO_AUTH_TOKEN
            const authToken = '77cd01c9b5bb6d3fa71f0e1d779eb9e8'

            // const client = require('twilio')(accountSid, authToken)
            const client = new twilio(accountSid, authTokens)

            client.calls
              .create({
                url: 'http://demo.twilio.com/docs/voice.xml',
                to: '+919042575202',
                // from: '+12232178772',
                from: '+16508256350',
              })
              .then((call) => console.log(call.sid))
              .catch((err) => console.log(err))
            // /********** *
          } else {
            console.log('Excluded theatres', new Date().toLocaleTimeString())
          }
        })
      } else if (bookingDate) {
        console.log('Booking date not same', new Date().toLocaleTimeString())
      } else {
        console.log('Booking not started', new Date().toLocaleTimeString())
      }

      browser.close()
      return data
    } catch (err) {
      console.log(err)
      console.log('not exist ')
    }
    // console.log(data)
    await browser.close()
  } catch (error) {
    console.log('error due to', error)
    await browser.close()
  }
}

app.get('/ticket', async (req, res) => {
  call()
  dial()
  // const theatre = await bot()
  // res.send('theatre', theatre)
  setInterval(async () => {
    let url
    Item.find({ name: 'Eat burger15' }, async (err, docs) => {
      if (err) {
        console.log(err)
      } else {
        url = docs[0].url
        console.log(url)
        const data = await bot(url)
        console.log(data)
      }
    })
    console.log(url)
    // await url
  }, 60000)
  // res.send(theatre)
})
const PORT = process.env.PORT || 5000
app.listen(PORT, (err) => {
  if (err) {
    throw err
  }
  console.log('Listening on port', PORT)
})

// setInterval(async () => {
bot('hello')
const allTheatres = [
  'la cinema maris complex rgb laser: trichy',
  'la cinema sona mina rgb laser: trichy',
  'ramba a/c dolby atmos: trichy',
  'star theatre a/c dts: trichy',
  'bhelec cinema a/c dolby 7.1: trichy',
  'jothi theatre a/c 4k 7.1 (viralimalai): trichy',
  'megastar cinemas: premium large format (plf) atmos',
  'sri venkatesa cinemas a/c dolby atmos',
  'mariyam cinemas a/c 4k: trichy',
  'cauvery cinemas a/c dolby 7.2',
  'saroja cinemas 2k a/c, ariyamangalam: trichy',
  'shanthi cinemas a/c 4k dolby atmos: thiruverumbur',
]
// const excludedTheatres = [
//   'sona',
//   'maris',
//   'ramba',
//   'star',
//   'bhelec',
//   'jothi',
//   'megastar',
//   'venkatesa',
//   'mariyam',
//   'cauvery',
//   'saroja',
//   'shanthi',
// ]
// allTheatres.forEach((theatre) => {
//   console.log(
//     'call',
//     excludedTheatres.every((exludeTheatre) => {
//       const excludeTheatrePattern = new RegExp(exludeTheatre, 'gim')
//       if (!theatre.match(excludeTheatrePattern)) return true
//       else return false
//     })
//   )
// })
// await url
// }, 15000)
var alreadyTriggered = false
setInterval(() => {
  if (!alreadyTriggered) {
    bot('hello')
  }
}, 60000)

// https://flaviocopes.com/puppeteer-scraping/
