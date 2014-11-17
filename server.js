/*
 * Module dependencies
 */
var express = require('express')
  , logger = require('morgan')
  , fs = require('fs');


var app = express();
app.use(express.static(__dirname + '/app')) //set static file location as the public directory
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(logger('dev')) //Log every request

var db = require('./db');
var newick = require('./newick');

/*
  Get structures from the DB. Filter set based on named
  query parameters
*/
app.get('/api/structures', function(req, res) {
  console.log(req.query);
  db.get_structures(req.query, function(err, all) {
    var structures = all;
    //console.log(structures);
    res.json(structures);
  });
});

/*
  Get a single structure by struct_id
*/
app.get('/api/structure/:id', function(req, res) {
  console.log(req.query);
  db.structure_by_id(req.params.id, function(err, all) {
    var structure = {};
    if(all.length > 0) {
      structure = all[0]
    }
    console.log(structure);
    res.json(structure);
  });
});


/*
  Retreive the phylogenetic tree in JSON
*/
app.get('/api/phylo', function(req, res) {
  var newick_data = fs.readFileSync('phylo_tree.newick', encoding='utf8');
  res.json(newick.parse(newick_data));
});

//Download the entire database
app.get('/api/download', function(req, res) {
  res.sendFile('/092014_UBSRD.db3');
});

app.get('/api/example1', function(req, res) {
  db.example1(function(err, all) {
    var query_result = all;
    console.log(query_result);
    res.json(query_result);
  });
});

/*
  The application!
*/
app.all('*', function(req, res) {
  res.sendfile('./app/index.html');
});

app.listen(3000)
