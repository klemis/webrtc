const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use("/static", express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
