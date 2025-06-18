// Module Imports
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// App Initialization
const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make cookies available to templates
app.use((req, res, next) => {
  res.locals.req = req;
  
  // If user is logged in, get their type
  if (req.cookies.userId) {
    db.query('SELECT type FROM user WHERE id = ?', [req.cookies.userId], (err, results) => {
      if (!err && results.length > 0) {
        res.cookie('type', results[0].type);
        next();
      } else {
        // User not found, clear cookies
        res.clearCookie('userId');
        res.clearCookie('username');
        res.clearCookie('type');
        next();
      }
    });
  } else {
    next();
  }
});

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Change to your local username
  password: 'Anthonyemmy16', // Change to your local password
  database: 'userAccount_db',
});
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
  if (!req.cookies.userId) return res.redirect('/');
  
  db.query('SELECT * FROM user WHERE id = ?', [req.cookies.userId], (err, results) => {
    if (err) throw err;
    
    const user = results[0];
    if (user.type === 'admin') {
      next();
    } else {
      return res.redirect('/');
    }
  });
};

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Auth & Account Routes

// Update user points after quiz
app.post('/updatePoints', (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.sendStatus(401);
  
  db.query(
    'UPDATE user SET points = points + ? WHERE id = ?', 
    [req.body.score, userId], 
    err => res.sendStatus(err ? 500 : 200)
  );
});

// User login
app.post('/auth', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err || results.length === 0) {
      return res.render('index', { showAuth: true, loginError: true });
    }
    const user = results[0];
    res.cookie('userId', user.id);
    res.cookie('username', user.username);
    res.cookie('type', user.type || 'normal');
    res.redirect('/accountPage');
  });
});

// User registration
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) return res.render('index', { showAuth: true, registerError: 'Registration failed' });
    if (results.length > 0) return res.render('index', { showAuth: true, emailExists: true });

    db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
      if (err) return res.render('index', { showAuth: true, registerError: 'Registration failed' });
      if (results.length > 0) return res.render('index', { showAuth: true, usernameExists: true });

      db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err) => {
        if (err) return res.render('index', { showAuth: true, registerError: 'Registration failed' });
        res.redirect('/accountPage');
      });
    });
  });
});

// Edit user account
app.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  
  db.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) return res.redirect('/accountPage');
    const currentUser = results[0];
    const newPassword = password && password.trim() !== '' ? password : currentUser.password;
    
    db.query('UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, newPassword, id], (err) => {
      if (err) return res.redirect('/accountPage');
      res.cookie('username', username);
      return res.redirect('/accountPage?updated=true');
    });
  });
});

// Leaderboard & Search (top 5)
app.post('/search', (req, res) => {
  const searchQuery = req.body.search;
  let query, params;
  
  if (!searchQuery || searchQuery.trim() === "") {
    query = 'SELECT id, username, points FROM user WHERE type != "admin" ORDER BY points DESC LIMIT 5';
    params = [];
  } else {
    query = 'SELECT id, username, points FROM user WHERE username LIKE ? AND type != "admin" ORDER BY points DESC LIMIT 5';
    params = [`%${searchQuery}%`];
  }
  
  db.query(query, params, (err, results) => {
    if (err) throw err;
    const noResults = results.length === 0;
    const userId = req.cookies.userId;
    db.query('SELECT * FROM user WHERE id = ?', [userId], (err, userResults) => {
      const user = userResults[0];
      res.render('accountPage', {
        username: user.username,
        email: user.email,
        password: "********",
        confirmEdit: false,
        users: results,
        noResults,
        searchQuery,
        user: user
      });
    });
  });
});

// Delete account
app.post('/deleteAccount', (req, res) => {
  const userId = req.cookies.userId;
  db.query('DELETE FROM user WHERE id = ?', [userId], (err) => {
    if (err) throw err;
    res.clearCookie('userId');
    res.clearCookie('username');
    res.redirect('/');
  });
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.clearCookie('username');
  res.clearCookie('type');
  res.redirect('/');
});

// Account page
app.get('/accountPage', (req, res) => {
  if (!req.cookies.userId) return res.redirect('/');
  
  db.query('SELECT * FROM user WHERE id = ?', [req.cookies.userId], (err, results) => {
    if (err) throw err;
    
    const user = results[0];
    
    db.query('SELECT id, username, points FROM user WHERE type != "admin" ORDER BY points DESC LIMIT 5', (err, leaderboardResults) => {
      if (err) throw err;
      
      res.render('accountPage', {
        username: user.username,
        email: user.email,
        password: "********",
        confirmEdit: req.query.updated === 'true',
        users: leaderboardResults,
        user: user
      });
    });
  });
});

// Home Page
app.get('/', (req, res) => {
  res.render('index', { loginError: false });
});

// Admin Routes
app.post('/admin/deleteUser/:id', checkAdmin, (req, res) => {
  const userId = req.params.id;
  
  db.query('DELETE FROM user WHERE id = ?', [userId], (err) => {
    if (err) throw err;
    return res.status(200).json({ message: 'User deleted successfully' });
  });
});

// API endpoint to get quiz questions by category
app.get('/api/quiz/:category', (req, res) => {
  const category = req.params.category;
  
  // Get questions and answers in a single query with JOIN
  const query = `
    SELECT q.id, q.question_text as question, a.answer_text as text, a.is_correct as correct
    FROM quiz_question q
    JOIN quiz_category c ON q.category_id = c.id
    JOIN quiz_answer a ON a.question_id = q.id
    WHERE c.name = ?
    ORDER BY q.id, a.id
  `;
  
  db.query(query, [category], (err, results) => {
    if (err) throw err;
    
    // Transform the flat results into a nested structure
    const questions = [];
    let currentQuestion = null;
    
    results.forEach(row => {
      // If this is a new question or the first row
      if (!currentQuestion || currentQuestion.question !== row.question) {
        currentQuestion = {
          question: row.question,
          answers: []
        };
        questions.push(currentQuestion);
      }
      
      // Add this answer to the current question and explicitly convert to boolean
      currentQuestion.answers.push({
        text: row.text,
        correct: row.correct === 1
      });
    });
    
    res.json(questions);
  });
});

// Error Handling

// 404 handler
app.use(function(req, res, next) {
  next(createError(404));
});

// General error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

