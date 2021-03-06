var express = require('express');

var app = express();

//var intentController = require('cloud/intent.js');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

//app.get('/intents', intentController.index);


// Example reading from the request query string of an HTTP get request.
app.get('/auth', function(req, res) {
	// GET http://example.parseapp.com/test?message=hello
	
	res.send(req.query);
});

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();