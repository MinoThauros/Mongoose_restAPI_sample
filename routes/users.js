var express = require('express');
//var bodyParser= require('body-parser'); deprecated; use express.json instead
var router = express.Router();
var User=require('../models/user');
router.use(express.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next)=>{
  User.findOne({username:req.body.username})
  .then((user)=>{//cant create the element like before because there is a default val
    if (user != null){
      var err= new Error('User '+ req.body.username + 'already exists');
      err.status=401;
      next(err)
    }else{
      return User.create({
        username:req.body.username,
        password:req.body.password});
    }
  })
    .then((user)=>{//chained after the latest returned promise
      res.status=200,
      res.setHeader('Content-Type','application/json');
      res.json({status: 'Registration Successful!!!', user:user})
      //loading user as a propriety in the json
    },(err)=>{next(err)})
  .catch((err)=>{

  })
});

router.post('/login',(req,res,next)=>{
  console.log(req.session);

  if(!req.session.user){//only exists after first auth
    var authHeader = req.headers.authorization;//triggers the prompt
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err);
        return;
      }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
    User.findOne({username:username})
    .then((user)=>{//cant create the element like before because there is a default val
      if (user === null){
        var err= new Error('User '+username+' not found');
        err.status=403;
        next(err)
      }
      else if(user.password !== password){
        var err= new Error('Wrong password');
        err.status=403;
        next(err)
      }

      else if (user.username === username && user.password === password) {
        req.session.user='authenticated';
        res.statusCode=200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('you are authenticated !')
        next(); // authorized

        } 
    })
    .catch((err)=>next(err))
  }else{
    status.code=200
    res.setHeader('Content-Type', 'text/plain');
    res.end('you are  already authenticated !')
    next(); // authorized
  }
  
  ;});

  router.get('/logout', (req,res,next)=>{
    if (req.session){
      req.session.destroy();
      //get because we're not sending anything to the body
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else{
      var err = new Error('You already in here')
      err.status=403;
      next(err)
    }
  })



module.exports = router;
