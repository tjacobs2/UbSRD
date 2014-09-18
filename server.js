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

// api used by Angular ---------------------------------------------------------------------
var Structures = require('./models/structures');

//todo
//app.get('/structure/struct_id', function(req, res) {
//app.get('/residue/struct_id & res_id', function(req, res) {

app.get('/api/structures', function(req, res) {
  Structures.all_structures(function(err, all) {
    var structures = all;
    console.log(structures);
    res.json(structures);
  });
});

app.get('/api/structures/:id', function(req, res) {
  Structures.structure_by_id(req.params.id, function(err, all) {
    var structure = {};
    if(all.length > 0) {
      structure = all[0]
    }
    console.log(structure);
    res.json(structure);
  });
});

app.get('/api/groups/:id', function(req, res) {
  Structures.group_structures(req.params.group_id, function(err, all) {
    var structures = all;
    console.log(structures);
    res.json(structures);
  });
});

// application -------------------------------------------------------------
app.all('*', function(req, res) {
  res.sendfile('./app/index.html');
});

app.listen(3000)
