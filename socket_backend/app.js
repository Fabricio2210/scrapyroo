const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require ('mongoose');
const keys = require('./bd/keys');
const path = require('path');
require('./io/SocketIoConexaoFrontEnd')(io);

mongoose.connect(keys.mongoURI,{ useNewUrlParser: true })
.then(() => console.log('MongoDB Conectado'))
.catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')))

const port  = process.env.PORT || 3000;

http.listen(port,()=> console.log(`Conectado na porta ${port}`))