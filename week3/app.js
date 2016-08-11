var express         = require('express'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    methodOverride  = require("method-override"),
    app             = express();

// APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

// DATABASE CONFIG
mongoose.connect("mongodb://localhost/occurences");

var encounterSchema = new mongoose.Schema({
  date: String,
  observer: String,
  species: String,
  female: Number,
  male: Number,
  adult: Number,
  young: Number,
  x: Number,
  y: Number,
  total: Number,
  location: String,
  comments: String
})

var Encounter = mongoose.model('Encounter', encounterSchema);

// test create database entry
// Encounter.create(
//   {
//     date: "7/28/2016",
//     species: "mountain goat",
//     x: -119.1234,
//     y: 35.1234,
//     location: "somewhere in America",
//     female: 5,
//     male: 2,
//     young: 3,
//     adult: 4,
//     total: 7,
//     observer: "Mitchell Gritts",
//     comments: "Jumping around the base of cliffs."
//   },
//   function(err, encounter){
//     if(err){
//       console.log(err);
//     } else {
//       console.log('NEW ENCOUNTER ADDED TO DATABASE');
//     }
//   });

// ROUTES

// home route '/'
app.get('/', function(req, res){
  res.redirect('/encounters')
});

// Index, GET - show all encounters, only for frm240
app.get('/encounters', function(req, res){
  Encounter.find({}, function(err, allEncounters){
    if(err){
      console.log(err);
    } else {
      res.render("encounters", {encounters:allEncounters});
    }
  });
});

// New, GET - go to form to enter new encounters
app.get('/encounters/new', function(req, res){
  res.render('frm240');
});

// Create, POST - create new encounter, then redirect to /encounters
app.post('/encounters', function(req, res){
  // create (add) new encounter to the database
  Encounter.create(req.body.encounter, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // redirect
      res.redirect('/encounters');
    }
  });
});

// Show, GET - go to individual encounter observation
app.get('/encounters/:id', function(req, res){
  Encounter.findById(req.params.id, function(err, foundEncounter){
    if(err){
      res.redirect('/encounters');
    } else {
      res.render('show240', {encounter: foundEncounter});
    }
  });
});

// Edit, GET - show edit form for an encounter
app.get('/encounters/:id/edit', function(req, res){
  Encounter.findById(req.params.id, function(err, foundEncounter){
    if(err){
      res.redirect('/encounters');
    } else {
      res.render('edit240', {encounter: foundEncounter});
    }
  });
});

// Update, PUT - update record, then redirect to the updated record
app.put('/encounters/:id', function(req, res){
  Encounter.findByIdAndUpdate(req.params.id, req.body.encounter, function(err, udpateEncounter){
    if(err){
      res.redirect('/encounters');
    } else {
      res.redirect('/encounters/' + req.params.id);
    }
  });
});

// Destroy, DELETE - delete record then redirect
app.delete('/encounters/:id', function(req, res){
  Encounter.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/encounters');
    } else {
      res.redirect('/encounters');
    }
  });
});

// LISTEN, SERVER
app.listen(3000, function(){
  console.log('app listening on port 3000');
});
