// href="/post/<%= usersPost._id %>"

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Load the full build.
const _ = require('lodash');

//initial content
const homeStartingContent = "You can log your daily activity in here";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// include mongoose in our project
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dailyJournalDB', {useNewUrlParser: true, useUnifiedTopology: true});

// open a connection to our local database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to the server');
});

// make a schema
const PostsSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: String
});

// compile Schema to model
const Post = mongoose.model('Posts', PostsSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

// home page
app.get('/', (req, res) => {

  Post.find({}, (err, results) => {

    res.render('home', {

      homeStartingContent: homeStartingContent,
      results: results

    });

  });

});

// about page
app.get('/about', (req, res) => {

  res.render('about', {

    aboutContent: aboutContent

  });

});

//contact page
app.get('/contact', (req, res) => {

  res.render('contact', {

    contactContent: contactContent

  });

});

//compose page
app.get('/compose', (req, res) => {

  res.render('compose');
  
});

//post req from compose page
app.post('/compose', (req, res) => {

  let date = Date();

  const post = new Post({

    title: req.body.postTitle,
    content: req.body.postContent,
    date: date

  });

  post.save(() => {

    res.redirect('/');

  });

});

//custom routing, in this case I use the ID of a document
app.get('/post/:id', (req, res) => {

  const id = req.params.id;

  Post.findById(id, (err, doc) => {

    if (err) {
      console.log(err);
    } else {
      // console.log(doc);
      res.render('post', {
        doc: doc
      });
    }

  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
