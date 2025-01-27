const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))



app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

app.get('/hello', (req, res) => {
  res.send("hello")
})

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

const port = process.env.PORT || 3000;

server.listen(port)
