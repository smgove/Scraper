var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Routes go here:

app.get("/scrape", function (req, res) {
  axios.get("https://www.nytimes.com/section/sports").then(function (response) {
    var $ = cheerio.load(response.data)
    $("article").each(function (i, element) {
      var result = {}
      result.title = $(this)
        .find("h2")
        .text();
      result.link = $(this)
        .find("a")
        .attr("href")
      result.text = $(this)
        .find("p")
        .text()
        .trim();
      db.Article.create(result)
        .then(function (dbArticle) {
        })
        .catch(function (err) {
          console.log(err)
        })
    })
    res.redirect("/");
  })
})
app.post("/articles/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } })
  .then(function (dbArticle) {
    res.json(dbArticle)
  })
  .catch(function (err) {
    res.json(err)
  })
})

app.get("/articles", function (req, res) {
  db.Article.find({saved: false})
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function (err) {
      res.json(err)
    })
})

app.get("/articles/saved", function (req, res) {
  db.Article.find({saved: true})
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function (err) {
      res.json(err)
    })
})

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function (err) {
      res.json(err)
    })

});

app.post("/notes/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id }}, {new:true})
    })
    .then(function (dbNote) {
      res.json(dbNote)
    })
    .catch(function (err) {
      res.json(err)
    })
});

app.get("/clear", function (req, res) {
  db.Article.deleteMany({}, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.redirect("/");
    }
  })
});

app.get("/deletenote/:id", function (req, res) {
  db.Note.deleteOne({ _id: req.params.id }, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log(result)
      res.redirect("/");
    }
  })
});

app.post("/articles/unsave/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: false } })
  .then(function (dbArticle) {
    res.json(dbArticle)
  })
  .catch(function (err) {
    res.json(err)
  })
})

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});