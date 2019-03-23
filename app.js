const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use("/static", express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'public/html'))
//   .set('view engine', 'ejs')
  .get('/', (req, res) => res.sendFile(__dirname + '/public/html/14.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
