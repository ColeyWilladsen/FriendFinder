//Linked json data
const friendsdata = require('./app/data/friends');
let friends = friendsdata;

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/app/public/home.html"));
});

app.get("/survey", function (req, res) {
  res.sendFile(path.join(__dirname, "/app/public/survey.html"));
});

// Displays all friends
app.get("/api/friends", function (req, res) {
  console.log(friendsdata.friends)
  return res.json(friends);
});

//Run survey logic  - takes in JSON input
app.post("/api/friends", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body-parser middleware


  var newfriend = req.body;

  //Logic to score the survey and find the best match
  var currentBestScore = 100;
  var currentLeader;
  var currentLeaderPic;
  var servResponse


  friends.forEach(element => {
    var currentScore = 0
    for (var i = 0; i < 10; i++) {
      
      currentScore += Math.abs(newfriend.responses[i] - element.scores[i])
      //console.log(currentScore,newfriend.responses[i],element.scores[i])
    }
    if (currentScore < currentBestScore) {
      currentBestScore = currentScore
      currentLeader = element.name
      currentLeaderPic = element.photo
    }
    
  });
   
  servResponse = {"name":currentLeader,"photo":currentLeaderPic}

  res.json(servResponse);

});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
