require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// API calls

app.get('/rovers/:roverName', async (req, res) => {
    try {
        let images = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.params.roverName}/latest_photos?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send(images); 
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Mars dashboard app listening on port ${port}!`))