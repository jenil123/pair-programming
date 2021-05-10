const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

//Port from environment variable or default - 3000
const port = process.env.PORT || 8080

//Setting up express and adding socketIo middleware
const app = express()
const server = http.createServer(app)
//const io = socketIo(server)
const io = socketIo(server, {
  cors: {
    origin: 'https://modest-roentgen-a77130.netlify.app',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
//console.log(io)
//Setting up a socket with the namespace "connection" for new sockets

io.on('connection', (socket) => {
  console.log('New client connected')
  socket.on('join', (room) => {
    console.log('room', room)
    socket.join(room)
  })

  //Here we listen on a new namespace called "incoming data"
  socket.on('data', (data) => {
    //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
    console.log('data', data)
    socket.to(data.room).emit('data', { data: data })
  })

  //A special namespace "disconnect" for when a client disconnects
  socket.on('disconnect', () => console.log('Client disconnected'))
})

server.listen(port, () => console.log(`Listening on port ${port}`))
