require('dotenv').config();
const port = 3000;
const express = require('express');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const {sendMail} = require('./models');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({secret: process.env.sessionSecret, resave: true, saveUninitialized: true, cookie: { maxAge: 60000}}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
    res.render('index');
  });

app.get('/services', function(req, res) {
    res.render('services');
});

app.get('/about', function(req, res) {
    res.render('about');
});

app.get('/contact', function(req, res) {
    var message = {
        alertName: req.flash('alertName'),
        text: req.flash('text')
    };
    res.render('contact', {message: message});
});

app.post('/contact', function(req, res) {
    var {name, email, phone, message} = req.body;
    var formObj = {name: name, email: email, phone: phone, message: message}
    console.log('sending Form: ')
    console.log(formObj);
    sendMail(formObj)
    .then((success) => {
        req.flash('alertName', 'alert-success');
        req.flash('text', 'Successfully submitted. Laura will be in touch with you soon.');
        res.redirect('/contact');
    })
    .catch((err) => {
        console.log('Error submitting form: ')
        console.log(err);
        req.flash('alertName', 'alert-danger');
        req.flash('text', 'Something went wrong. Please reach out to Laura at laurareaamft@gmail.com.');
        res.redirect('/contact');
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Laura's site is listening on port ${process.env.PORT || 5000}`)
});
