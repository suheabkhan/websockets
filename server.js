const express=require('express');
const app=express();
require('./models/dataBaseConnectivity');
const commentRoute=require('./routes/routes');
const bodyParser=require('body-parser');
const PORT=7000;

// ? static folder which has our frontend
app.use(express.static('public'));
app.use(bodyParser.json())
app.use('/comment',commentRoute);

const server=app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
});

let io=require('socket.io')(server)

io.on('connection',(socket)=>{
console.log(`New Connection is: ${socket.id}`);
// ? receivuing the data from UI
// ? here the "comment" is the same name as that used in the app.js file which is our js file
socket.on('comment',(data)=>{
    // ? Now need to emit this data to all the browsers,sockets,machines which are connected to this socket
   //? so flow the will be like, our computer will emit the data to server, then server distributes the data to all the 
        //? browsers which are connected to it..so that all the browser gets the new data (i.e they will have all comments)

        //? adding time field to the data object
  data.time=Date();
  // ? server has received the data and now it is sending all the data to all its connected browsers
  socket.broadcast.emit('comment',data);
})
socket.on('typing',(data)=>{
    socket.broadcast.emit('typing',data);
})
})