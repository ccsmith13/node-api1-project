var db = require('./data/db')

const express = require('express'); // import the express package

const server = express(); // creates the server

server.get('/', (req, res) => {
    res.send('Hello from Express');
});

server.get('/users', (req, res) => {
    const users = db.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The users information could not be retrieved." })
        })
});

server.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = db.findById(id)
        .then(user => {
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ message: 'Could not find user with given id.' })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The users information could not be retrieved." })
        })
});

server.post('/users', (req, res) => {
    const user = (req.query)
    if (req.query.name && req.query.bio) {
        db.insert(user)
            .then(user => {
                res.status(201).json({ message: "Successfully added a user." })
                res.json(user);
            })
            .catch(err => {
                res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
            })
    }
    else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
});

server.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = db.findById(id);
    console.log('req in delete request:', req);
    db.remove(id)
        .then(user => {
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user could not be removed" })
        })
});

server.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = req.query
    db.update(id, user)
        .then(user => {
            if ((req.query.name) && (req.query.bio)) {
                res.json(req.query)
            }
            else {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user information could not be modified." })
        })
});

server.listen(5000, () =>
    console.log('Server running on http://localhost:5000')
);