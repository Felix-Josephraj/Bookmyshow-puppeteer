const puppeteer = require('puppeteer')
const express = require('express')
const app = express()

const bot = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto(
    // 'https://in.bookmyshow.com/trichy/cinemas/la-cinema-maris-complex-rgb-laser-trichy/LATG/20230119'
    'https://in.bookmyshow.com/buytickets/m3gan-chennai/movie-chen-ET00343701-MT/20230118'
    //  'https://in.bookmyshow.com/buytickets/<movie>-trichy/movie-tric-<movie id>-MT/<date>'
  )

  /* Run javascript inside the page */
  const data = await page.evaluate(() => {
    const list = []
    const items = 'de'
    // const items = document.querySelector('a.nameSpan').innerHTML

    // for (const item of items) {
    //   list.push({
    //     company: item.querySelector('.company h3').innerHTML,
    //     position: item.querySelector('.company h2').innerHTML,
    //     link: 'https://remoteok.io' + item.getAttribute('data-href'),
    //   })
    // }

    return items

    // return list
  })

  console.log(data)
  // await browser.close()
  return data
}

app.get('/ticket', async (req, res) => {
  const theatre = await bot()
  // res.send('theatre', theatre)
  res.send(theatre)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, (err) => {
  if (err) {
    throw err
  }
  console.log('Listening on port', PORT)
})

// https://flaviocopes.com/puppeteer-scraping/
