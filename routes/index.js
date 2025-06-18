var express = require('express');
var router = express.Router();

// Middleware to check authentication
const checkAuth = (req, res, next) => {
  res.locals.isAuthenticated = req.cookies.userId ? true : false;
  res.locals.username = req.cookies.username || '';
  next();
};

// Apply the middleware to all routes
router.use(checkAuth);

router.get('/', function(req, res, next) {
  res.redirect('/home');
});

router.get('/home', function(req, res, next) {
  res.render('home');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/pollution', function(req, res, next) {
  res.render('pollution');
});

router.get('/overfishing', function(req, res, next) {
  res.render('overfishing');
});

module.exports = router;