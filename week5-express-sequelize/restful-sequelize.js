var express = require('express');
var Sequelize = require('sequelize');
var faker = require('faker');
var bodyParser = require('body-parser');
var app = express();

// app configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// connect to database (user your username and password)
var sequelize = new Sequelize('testdb', 'username', 'password', {
    dialect: 'postgres'
});

var User = sequelize.define('user', {
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING
},{
    underscored: true
});
User.sync().then(function(){
    User.create({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email
    });
});

// INDEX - show all users (get)
app.get('/users', function(req, res){
    User.findAll().then(function(users){
        res.json(users);
    });
});

// SHOW - show one user (get)
app.get('/users/:id', function(req, res){
    User.findById(req.params.id).then(function(user){
        res.json(user);
    });
});

// CREATE - create new user(post)
app.post('/users', function(req, res){
    User.create({
        // data to create a new use in the database
        first_name: req.body.first,
        last_name: req.body.last,
        email: req.body.email
    }).then(function(user){
        res.json({
            message: 'User Created',
            created: user
        });
    });
});

// PUT - update an existing record (update)
app.put('/users/:id', function(req, res){
    User.update({
        // data to update to user
        first_name: req.body.first,
        last_name: req.body.last,
        email: req.body.email
    }, {
        // find the current user in the database to update
        where: {id: req.params.id}
    }).then(function(user){
        res.json({
            message: 'User updated',
            updated: user
        });
    });
});

app.listen(3000, function(){
    console.log('app listening on port 3000');
});
