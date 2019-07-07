require('./config/config');

const _ = require('lodash')
const path = require('path');
const http = require('http');
const hbs = require('hbs');
const socketIO = require('socket.io');
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const multer = require('multer');
const events = require('events');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');
var { validateAuth } = require('./middleware/validateAuth');

const publicPath = path.join(__dirname + '/public');
const port = process.env.PORT || 3000;

const upload = multer();
const app = express();
app.use(session({
  cookieName: 'salesSess',
  secret: "session123",
  resave: true,
  saveUninitialized: true
}));
const eventEmitter = new events.EventEmitter();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', hbs);
app.use(express.static(publicPath, { index: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(upload.array());

let loginRouter = require('./routes/login')
let logoutRouter = require('./routes/logout')
let shopRouter = require('./routes/shop')
let cartRouter = require('./routes/cart')

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content_security_policy", "default-src 'self' style-src 'self' 'unsafe-inline'")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get('/', (req, res) => {
  res.redirect('/login')
})
app.get('/home', (req, res) => {
  res.render('home.hbs')
})
app.use('/login', loginRouter);
app.use('/logout', logoutRouter)
app.use('/shop', shopRouter)
app.use('/cart', cartRouter)

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', validateAuth, (req, res) => {
  res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


let server = http.createServer(app);
let io = socketIO(server);
server.listen(port, function () {
  console.log(`Server is up on: http://localhost:${server.address().port}`);
});

io.on('connection', function (socket) {
  console.log('New User connected');
  //console.log(socket);
  eventEmitter.on('newTransaction', (time) => {
    socket.emit('newTransaction', time);
  });
  socket.on('disconnect', function () {
    console.log('User disconnected from server');
    socket.conn.close();
  });
});
