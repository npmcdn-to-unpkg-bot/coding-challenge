var express     = require("express"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
methodOverride  = require("method-override"),
app             = express();

// app config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// db config
mongoose.connect("mongodb://localhost/restful_blog");

// model config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://hd.unsplash.com/photo-1465420961937-e0eba4dda519",
//   body: "Hello this is a blog post."
// });

// routes
// index route
app.get("/", function (req, res){
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("ERROR");
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

// New Route
app.get("/blogs/new", function(req, res){
  res.render("new");
});

// Create Route
app.post("/blogs", function(req, res){
  //create blogs
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    } else {
      res.redirect("/blogs")
    }
  });
});

// Show
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect('/blogs');
    } else {
      res.render("show", {blog:foundBlog});
    }
  });
});

// Edit Route
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

// Update Route
app.put("/blogs/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Destroy Route
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

// server config
app.listen(3000, function(){
  console.log('Server is running on port 3000');
});
