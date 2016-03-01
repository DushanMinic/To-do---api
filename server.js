var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoID});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}	
});

// POST  /Ttodos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed'); // Use _.pick to only pick description and complete

	if(!_.isBoolean(body.completed) || !_.isString(body.description) ||
		body.description.trim().length === 0) {
		return res.status(400).send();
	} 


// set body.description to be trimmed value
body.description = body.description.trim();


// add id field
body.id = todoNextId++;

// push body into array
todos.push(body);
	

	res.json(body);
});

//DELETE /todos/:id

app.delete('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoID});

		if(!matchedTodo) {
			res.status(404).json({"error": "no todo found with that id"});
		} else {
			todos = _.without(todos, matchedTodo);
			res.json(matchedTodo);
		}
	

});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoID = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoID});
	var body = _.pick(req.body, 'description', 'completed'); 
	var validAttributes = {};

	if(!matchedTodo) {
		return res.send(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	} 

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	// _.extend - Copy all of the properties in the source objects 
	// over to the destination object, and return 
	// the destination object.
	
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);



});





// EXPRESS server

app.listen(PORT, function () {
	console.log('Express listening on port: ' + PORT);
});