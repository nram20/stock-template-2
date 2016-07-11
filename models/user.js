'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var bcrypt = require('bcryptjs');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET');
}

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // isAdmin: { type: String, default: false },
  stocks: [{
    stockId: { type: String },
    stockName: { type: String },
    lastPrice: { type: Number }
  }]
});

userSchema.statics.auth = function (role) {
  return (req, res, next) => {
    var token = req.cookies.accessToken;

    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if(err) return res.status(401).send({error: 'Auth required.'});

      User.findById(payload._id, (err, user) => {
        if(err || !user) return res.status(401).send({error: 'User not found.'});
        req.user = user;

        if(role === 'admin' && !req.user.isAdmin) {
          // check for admin priviliges
          return  res.status(403).send({error: 'Auth required.'});
        }
        // normal user
        next();
      });
    });
  };
};


// IT'S MIDDLEWARE!!
userSchema.statics.isLoggedIn = function(req, res, next) {
  var token = req.cookies.accessToken;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send({error: 'Must be authenticated.'});

    User
      .findById(payload._id)
      .select({password: false})
      .exec((err, user) => {
        if(err || !user) {
          return res.clearCookie('accessToken').status(400).send(err || {error: 'User not found.'});
        }

        req.user = user;
        next();
      })
  });
};

userSchema.statics.register = function(userObj, cb) {
  User.findOne({username: userObj.email}, (err, dbUser) => {
    if(err || dbUser) return cb(err || { error: 'Email not available.' })

    bcrypt.hash(userObj.password, 12, (err, hash) => {
      if(err) return cb(err);

      var user = new User({
        email: userObj.email,
        password: hash,
        isAdmin:  userObj.isAdmin
      })

      user.save(cb)
    })
  })
};

userSchema.statics.editProfile = function(userId, newUser, cb) {
  bcrypt.hash(newUser.password, 12, (err, hash) => {
    if(err) return cb(err);
    newUser.password = hash;
    User.findByIdAndUpdate(userId, { $set: newUser }, {new: true}, cb);
  })
};

userSchema.statics.authenticate = function(userObj, cb) {
  // find the user by the username
  // confirm the password

  // if user is found, and password is good, create a token
  this.findOne({email: userObj.email}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || { error: 'Login failed. Username or password incorrect.' });

    bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
      if(err || !isGood) return cb(err || { error: 'Login failed. Username or password incorrect.' });

      var token = dbUser.makeToken();

      cb(null, token, dbUser._id);
    })
  });
};

userSchema.statics.addStock = function(userId, stockObj, cb) {
  User.findById(userId, (err, user) => {
    if(err) cb(err);

    user.stocks.push(stockObj)
    user.save(cb)
  })
};

userSchema.statics.addStockToSpecific = function(userId, stockId, stockObj, cb) {
  User.findById(userId, (err, user) => {
    if(err) cb(err);

    var idx = 0;
    var stock = user.stocks.filter((stock, i) => {
      if(stock.stockId.toString() === stockId.toString()) idx = i;
      return stock.stockId.toString() === stockId.toString();
    })[0];

    user.stocks[idx].price = stockObj.price || stock.price;

    user.save(cb);
  })
};

userSchema.statics.editStock = function(userId, stockId, stockObj, cb) {
  User.findById(userId, (err, user) => {
    if(err) cb(err);
    var idx = 0;
    var stock = user.stocks.filter((stock, i) => {
      if(stock._id.toString() === stockId.toString()) idx = i;
      return stock._id.toString() === stockId.toString();
    })[0];

    user.stocks[idx].price = stockObj.price || stock.price;

    user.save((err) => {
      cb(err);
    })
  })
};

userSchema.statics.deleteStock = function(userId, stockId, cb) {
  User.findById(userId, (err, user) => {
    if(err) cb(err);
    user.stocks = user.stocks.filter((stock) => {
      return stock._id.toString() !== stockId.toString();
    });
    user.save(cb);
  })
};

userSchema.methods.makeToken = function() {
  var token = jwt.sign({
    _id: this._id,
    exp: moment().add(1, 'day').unix() // in seconds
   }, JWT_SECRET);
  return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
