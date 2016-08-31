var express = require('express');
var Sequelize = require('sequelize');
var faker = require('faker');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

// app configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');

var sequelize = new Sequelize('testdb', null, null, {
    dialect: 'postgres'
});

// database
var User = sequelize.define('user', {
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING
},{
    underscored: true
});
var Project = sequelize.define('project', {
    project_name: Sequelize.STRING,
    description: Sequelize.TEXT
}, {
    underscored: true
});

User.hasMany(Project);
Project.belongsTo(User);

sequelize.sync();

// User.create({
//     first_name: faker.name.firstName(),
//     last_name: faker.name.lastName(),
//     email: faker.internet.email()
// });

// Project.create({
//     project_name: faker.lorem.words(),
//     description: faker.lorem.paragraph(),
//     user_id: 15
// });

// INDEX - show all users (get)
app.get('/users', function(req, res){
    User.findAll().then(function(users){
        res.render('index', {users: users});
    });
});
// CREATE - create new user (post)
app.post('/users', function(req, res){
    User.create(req.body.obs).then(function(){
        res.redirect('/users');
    });
});
// SHOW - show one user (get)
app.get('/users/:id', function(req, res){
    User.findById(req.params.id).then(function(user){
        res.render('show', {user:user});
    });
});
// EDIT - get page to edit user (get)
app.get('/user/:id/edit', function(req, res){
    User.findById(req.params.id).then(function(user){
        res.render('edit', {user:user});
    });
});
// UPDATE - edit the current user (put/patch)
app.put('/users/:id', function(req, res){
    User.update(req.body.obs, {
        where: {id: req.params.id}
    }).then(function(){
        res.redirect('/users/' + req.params.id);
    });
});
// DELETE - delete the current user (delete/destroy)
app.delete('/users/:id', function(req, res){
    User.destroy({
        where: {id: req.params.id}
    }).then(function(){
        res.redirect('/users');
    });
});

// start server
app.listen(3000, function(){
    console.log('app listening on port 3000');
});
