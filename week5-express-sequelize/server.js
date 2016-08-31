var express = require('express');
var Sequelize = require('sequelize');
var faker = require('faker');
var bodyParser = require('body-parser');
var app = express();

// app configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('view engine', 'ejs');

var sequelize = new Sequelize('testdb', 'mitchellgritts', 'madrush8', {
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

// RESTFULL ROUTES
// landing
// app.get('/', function(req, res){
//     res.json({message: 'landing page'});
// });

// INDEX - show all users (get)
app.get('/', function(req, res){
    res.render('register');
    // User.findAll().then(function(users){
    //     res.json(users);
    // });
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
        first_name: req.body.first,
        last_name: req.body.last,
        email: req.body.email
    }, {
        where: {id: req.params.id}
    }).then(function(user){
        res.json({
            message: 'User updated',
            updated: user
        });
    });
});
// DELETE - delete user (delete)
app.delete('/users/:id', function(req, res){
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(deleted){
        if(deleted === 1){
            res.json({message: 'Successfully deleted!'});
        }
    });
});

app.listen(3000, function(){
    console.log('app listening on port 3000');
});
