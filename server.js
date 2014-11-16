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

//Retreive all structures
app.get('/api/structures', function(req, res) {
  db.all_structures(function(err, all) {
    var structures = all;
    console.log(structures);
    res.json(structures);
  });
});

//Retreive structures by structure id
app.get('/api/structures/:id', function(req, res) {
  db.structure_by_id(req.params.id, function(err, all) {
    var structure = {};
    if(all.length > 0) {
      structure = all[0]
    }
    console.log(structure);
    res.json(structure);
  });
});

//Retreive structures by PDB list
app.get('/api/pdbs/:pdbs', function(req, res) {
  var pdb_codes = req.params.pdbs.split(',');
  db.structure_by_pdb_codes(pdb_codes, function(err, all) {
    var structures = all;
    console.log(structures);
    res.json(structures);
  });
});

//Retreive structures by ineraction type
app.get('/api/groups/:id', function(req, res) {
  console.log("Getting group!");
  db.group_structures(req.params.id, function(err, all) {
    var structures = all;
    console.log(structures);
    res.json(structures);
  });
});

//Retreive the phylogenetic tree in JSON
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

// application -------------------------------------------------------------
app.all('*', function(req, res) {
  res.sendfile('./app/index.html');
});

app.listen(3000)
