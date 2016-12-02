/**
 * Module dependencies.
 */
//note -"socket.io -v @0.9"
var express = require('express')
  , io = require('socket.io')
  , http = require('http')
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob
  , _ = require('underscore')
  , path = require('path');

//AWS requirements
var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./credentials.json');
var s3 = new AWS.S3();
var session = require("express-session");
var userLib = require("./user.js");



//Create an express app/mongo connection
var app = express();
var methodOverride = require("method-override");
var hostname = process.env.HOSTNAME || "localhost";
var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");
var db = require("./node_modules/mongoskin").db("mongodb://user:password@127.0.0.1:27017/opNews");


//Create the HTTP server with the express app as an argument
var server = http.createServer(app);

// Twitter api keys
var api_key = 'm6hsOVSkPuycGoKqd0tP8XqYn';               // <---- Fill me in
var api_secret = 'vZUHgB7SfWBKREIeJpgemFmDP4KRMaxiHbndm1adMkpWxpVx7s';            // <---- Fill me in
var access_token = '770030619283914752-3172hGkI3luVYW1fQIinOSqrfsePZfm';          // <---- Fill me in
var access_token_secret = 'Moi180dRvjWt2zZ83BQlZBcmcGopBHGfF5MHmFEhRyRXs';    // <---- Fill me in

// Twitter symbols array.
var watchSymbols = ['#trump', '#apple', '#tgif'];//, '$goog', '$nok', '$nvda', '$bac', '$orcl', '$csco', '$aapl', '$ntap', '$emc', '$t', '$ibm', '$vz', '$xom', '$cvx', '$ge', '$ko', '$jnj'];

//This structure will keep the total number of tweets received and a map of all the symbols and how many tweets received of that symbol
var watchList = {
    total: 0,
    symbols: {}
};

//Set the watch symbols to zero.
_.each(watchSymbols, function(v) { watchList.symbols[v] = 0; });

//cons implemented for html view engine
var cons = require('consolidate');


//Generic Express setup
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.engine('html', cons.swig)
app.set('view engine', 'html');
//app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/views'));
app.use(express.static(path.join(__dirname, 'views')));


//aws/mongo---->>>
app.use(session({ secret: "This is a secret" }));
app.use(methodOverride());
//app.use(bodyParser());
app.use(require('connect').bodyParser());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/views'));
app.use(errorHandler());
app.use('/components', express.static(path.join(__dirname, 'components')));

app.get("/login", function (req, res) {
    res.redirect("/login.html");
});

app.get("/feed", function (req, res) {
    res.redirect("/feed.html");
});

app.get("/graph", function (req, res) {
    res.redirect("/graph.html");
});

//navigation/mongoDB storage--->
app.get('/getDashboard', function (req, res) {

    var args = req.query;

    var skipArg = parseInt(req.query.skip);
    var limitArg = parseInt(req.query.limit);
    //if(user){}
    //console.log(args.size);
    console.log(args.userID);


    db.collection("posts").find().sort({ id: -1 }).limit(limitArg).skip(skipArg).toArray(function (err, result) {
        if (result) {
            res.send(JSON.stringify(result));


        }
    });
});

//User Creation
app.get("/createUser", function (req, res) {
    userLib.add(req, res, db);
});

app.get("/editUser", function (req, res) {
    userLib.edit(req, res, db);
});

app.get("/changePassword", function (req, res) {
    userLib.changePassword(req, res, db);
});

app.get("/login", function (req, res) {
    userLib.login(req, res, db);
});

app.get("/getUser", function (req, res) {
    userLib.get(req, res, db);
});

function readURL(url, cb) {
    var data = "";
    var protocol = url.split("://")[0];
    var request = require(protocol).get(url, function (res) {
        res.on("data", function (chunk) {
            data += chunk;
        });

        res.on("end", function () {
            cb(data);
        })
    });

    request.on("error", function (e) {
        console.log("Got error: " + e.message);
    });
}

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + "/public"));
app.use(errorHandler());



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Our only route! Render it with the current watchList
app.get('/', function(req, res) {
	res.render('index', { data: watchList });
});

//Start a Socket.IO listen
var sockets = io.listen(server);

//Set the sockets.io configuration.
//THIS IS NECESSARY ONLY FOR HEROKU!
//sockets.configure(function() {
  //sockets.set('transports', ['xhr-polling']);
  //sockets.set('polling duration', 10);
//});

//If the client just connected, give them fresh data!
sockets.sockets.on('connection', function(socket) { 
    socket.emit('data', watchList);
});

// Instantiate the twitter connection
var t = new twitter({
    consumer_key: api_key,
    consumer_secret: api_secret,
    access_token_key: access_token,
    access_token_secret: access_token_secret
});

// //Tell the twitter API to filter on the watchSymbols 
t.stream('statuses/filter', { track: watchSymbols }, function(stream) {

  //We have a connection. Now watch the 'data' event for incomming tweets.
  stream.on('data', function(tweet) {

    //This variable is used to indicate whether a symbol was actually mentioned.
    //Since twitter doesnt why the tweet was forwarded we have to search through the text
    //and determine which symbol it was ment for. Sometimes we can't tell, in which case we don't
    //want to increment the total counter...
    var claimed = false;

    //Make sure it was a valid tweet
    if (tweet.text !== undefined) {

      //We're gunna do some indexOf comparisons and we want it to be case agnostic.
      var text = tweet.text.toLowerCase();

      //Go through every symbol and see if it was mentioned. If so, increment its counter and
      //set the 'claimed' variable to true to indicate something was mentioned so we can increment
      //the 'total' counter!
      _.each(watchSymbols, function(v) {
          if (text.indexOf(v.toLowerCase()) !== -1) {
              watchList.symbols[v]++;
              claimed = true;
          }
      });

      //If something was mentioned, increment the total counter and send the update to all the clients
      if (claimed) {
          //Increment total
          watchList.total++;

          //Send to all the clients
          sockets.sockets.emit('data', watchList);
      }
    }
  });
});

//Reset everything on a new day!
//We don't want to keep data around from the previous day so reset everything.
new cronJob('0 0 0 * * *', function(){
    //Reset the total
    watchList.total = 0;

    //Clear out everything in the map
    _.each(watchSymbols, function(v) { watchList.symbols[v] = 0; });

    //Send the update to the clients
    sockets.sockets.emit('data', watchList);
}, null, true);

//Create the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
