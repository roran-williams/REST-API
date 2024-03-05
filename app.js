//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////// Requests Targeting all Articles ////////////////////////

app.route("/articles")

  .get(function(req, res){
    Article.find({}, function(err, foundArticles){
      if (!err) {
        res.send(foundArticles);
      } else {
        res.status(500).send(err); // Proper error status code
      }
    });
  })

  .post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err){
      if (!err){
        res.send("Successfully added a new article.");
      } else {
        res.status(500).send(err); // Proper error status code
      }
    });
  })

  .delete(function(req, res){
    Article.deleteMany({}, function(err){
      if (!err){
        res.send("Successfully deleted all articles.");
      } else {
        res.status(500).send(err); // Proper error status code
      }
    });
  });

//////////////////////////////// Requests Targeting A Specific Article ////////////////////////

app.route("/articles/:articleTitle")

  .get(function(req, res){
    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle){
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.status(404).send("No articles matching that title were found."); // Proper error status code
      }
    });
  })

  .put(function(req, res){
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        } else {
          res.status(500).send(err); // Proper error status code
        }
      }
    );
  })

  .patch(function(req, res){
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      function(err){
        if(!err){
          res.send("Successfully updated article.");
        } else {
          res.status(500).send(err); // Proper error status code
        }
      }
    );
  })

  .delete(function(req, res){
    Article.deleteOne(
      { title: req.params.articleTitle },
      function(err){
        if (!err){
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.status(500).send(err); // Proper error status code
        }
      }
    );
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
