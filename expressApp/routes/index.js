var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgress://postgres:434@localhost:5432/todo';

// POST
router.post('/api/v1/todos', function(req,res) {
  var results = [];
  var data = {text: req.body.text, complete: false};

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query("INSERT INTO items (text, complete) VALUES ($1, $2)", [data.text, data.complete]);
    var query = client.query("SELECT * FROM items ORDER BY id ASC");
    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

// GET
router.get('/api/v1/todos', function(req, res) {
  var results = [];
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var query = client.query("SELECT * FROM items ORDER BY id ASC");
    query.on('row', function(row) {
      results.push(row);
    });
    query.on('end', function(){
      done();
      return res.json(results);
    });
  } );
});


// UPDATE
router.put('/api/v1/todos/:id', function(req, res) {
  var results = [];
  var id = req.params.id;
  var data = {text: req.body.text, complete: req.body.complete};
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query("UPDATE items SET text=($1), complete=($2) WHERE id = ($3)", [data.text, data.complete, id]);
    var query = client.query("SELECT * FROM items ORDER BY id ASC");
                
    query.on('row', function(row) {
      results.push(row);
    });
    query.on('end', function() {
      done();
      return res.json(results); 
    });
  });
});

// DELETE
router.delete('/api/v1/todos/:id', function(req, res){
  var results = [];
  var id = req.params.id;
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    client.query("DELETE FROM items WHERE id = ($1)", [id]);
    var query = client.query("SELECT * FROM items ORDER BY id ASC");

    query.on('row', function(row) {
      results.push(row);
    });
    query.on('end', function() {
      done();
      return res.json(results);
    })
  });
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
