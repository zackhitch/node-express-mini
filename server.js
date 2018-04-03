const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const db = require('./data/db.js');

const server = express();

//middleware
server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
  res.send({ api: 'Running......' });
});

server.get('/api/users', (req, res) => {
  //get the data
  db
    .find()
    .then(users => {
      //send the data
      res.json(users);
    })
    .catch(error => {
      //send the error if there is one
      res.status(500).json(error);
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  //get the data
  db
    .findById(id)
    .then(users => {
      //send the data
      res.json(users[0]);
    })
    .catch(error => {
      //send the error if there is one
      res.status(500).json(error);
    });
});

//localhost:5000/api/users/search?userid=2
server.get('/api/users/search', (req, res) => {
  const { userid } = req.query;
  db
    .findById(userid)
    .then(users => {
      res.json(users[0]);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post('/api/users', (req, res) => {
  const user = req.body;
  db
    .insert(user)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      res.status(500).json({
        error: 'There was an error while serving the user to the database.'
      });
    });
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  let user;

  db
    .findById(id)
    .then(response => {
      user = { ...response[0] };
      db
        .remove(id)
        .then(response => {
          res.status(200).json(user);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const update = req.body;

  let user;

  db
    .update(id, update)
    .then(count => {
      if (count > 0) {
        db
          .findById(id)
          .then(updatedUsers => {
            res.status(200).json(updatedUsers[0]);
          })
          .catch();
      } else {
        res.status(404).json({ message: 'user at that id doesnt exist' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

const port = 5000;
server.listen(port, () => console.log('API running on port 5000'));
