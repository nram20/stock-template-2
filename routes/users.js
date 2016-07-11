'use strict';

var express = require('express');
var router = express.Router();


var User = require('../models/user');

router.get('/', User.isLoggedIn, (req, res) => {
  User.find({}, (err, users) => {
    res.status(err ? 400 : 200).send(err || users);
  }).select({password: false});
});

//   /api/users/register
router.post('/register', (req, res) => {
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err || "Successful registration!");
  });
});

//   /api/users/login
router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, token, id) => {
    if(err) return res.status(400).send(err);
    res.cookie('accessToken', token).send(id);
  });
});

//   /api/users/logout
router.delete('/logout', (req, res) => {
  res.clearCookie('accessToken').send('You\'ve successfully logged out!');
});

// /api/users/profile
router.get('/profile', User.isLoggedIn, (req, res) => {
  console.log('req.user:', req.user);
  res.send(req.user);
})

// /api/users/profile
router.put('/profile', User.isLoggedIn, (req, res) => {
  User.editProfile(req.user._id, req.body, (err, edtUser) => {
    if(err) return res.status(400).send(err);
    console.log(edtUser);
    res.send(edtUser);
  })
})

// /api/users/people
router.get('/people', User.isLoggedIn, (req, res) => {
  User
    .find({_id: {$ne: req.user._id}}) // excludes the logged in user
    .exec((err, users) => {
      return err ? res.status(400).send(err) : res.send(users);
    });
})

// /api/users/people
router.get('/people/:id', User.isLoggedIn, (req, res) => {
  User.findById(req.params.id)
    .select({password: false})
    .exec((err, user) => {
    return err ? res.status(400).send(err) : res.send(user);
  })
})

router.post('/addStock', User.isLoggedIn, (req, res) => {
  User.addStock(req.user._id, req.body, (err) => {
    if(err) return res.status(400).send(err);
    return res.send('You have added a new stock!');
  });
})

// router.post('/addRatingToSpecific/:beerid', User.isLoggedIn, (req, res) => {
//   User.addRatingToSpecific(req.user._id, req.params.beerid, req.body, (err) => {
//     if(err) return res.status(400).send(err);
//     return res.send('You have updated a stock!');
//   });
// })

// userId, ratingId, ratingObj
router.put('/editStock/:id', User.isLoggedIn, (req, res) => {
  User.editStock(req.user._id, req.params.id, req.body, (err) => {
    if(err) return res.status(400).send(err);
    return res.send('You have edited the stock!');
  });
})

router.delete('/deleteStock/:id', User.isLoggedIn, (req, res) => {
  User.deleteStock(req.user._id, req.params.id, (err) => {
    if(err) return res.status(400).send(err);
    return res.send('You have deleted a stock!');
  });
})

// router.get('/getNotSampled', User.isLoggedIn, (req, res) => {
//   User.findById(req.user._id, (err, user) => {
//     if(err) return res.status(400).send(err);
//     user.ratings = user.ratings.filter((rating) => {
//       return rating.score === undefined;
//     });
//     return err ? res.status(400).send(err) : res.send(user.ratings);
//   })
// })

module.exports = router;
