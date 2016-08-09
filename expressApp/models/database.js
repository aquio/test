var pg = require('pg');
var connectionString = 'postgress://postgres:434@localhost:5432/todo';
var client = new pg.Client(connectionString);

/*var client = new pg.Client({
      user: 'postgres',
      password: '434',
      database: 'todo',
      host: 'localhost',
      port: 5432
    });*/


client.connect();   
var query = client.query('CREATE TABLE items (id SERIAL PRIMARY KEY, text VARCHAR(40) NOT NULL, complete BOOLEAN)');
query.on('end', function() {client.end();});