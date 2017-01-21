const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');

require('./server/models').connect(config.dbUri);

const app = express();
//static files
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

//load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

//pass the authentication cheker middleware
const authCheckMiddleWare = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleWare);


//routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

//start the server
app.listen(3000,()=>{
  console.log('Starting server at port 3000');
});
