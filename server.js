const express = require('express');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3001;

var arrUser = [];

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.set('views', './views');

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('connect success on ', socket.id);

    socket.on('client-add-user', (data) => {
        if(arrUser.indexOf(data)>= 0) {
            //fail
            socket.emit("server-add-fail");
        }else {
            //success
            arrUser.push(data);
            socket.Username = data;
            socket.emit("server-add-success", data);
            io.sockets.emit("server-send-listUser", arrUser);
        }
    })

    socket.on("client-logout", () => {
        arrUser.splice(
            arrUser.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-listUser", arrUser);
    })

    socket.on("client-send-message",(data) => {
        io.sockets.emit("server-send-message", {ten: socket.Username, nd: data});
    })

    socket.on('user-typing', () => {
        var s = socket.Username + ' is typing';
        io.sockets.emit("anyone-typing", s);
    })

    socket.on('stop-typing', () => {
        io.sockets.emit("anyone-stop-typing");
    })
})

app.get('/', (req, res) => {
    res.render('home');
})


server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});