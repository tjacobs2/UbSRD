/*
 * Module dependencies
 */
var express = require('express')
  , logger = require('morgan')
  , fs = require('fs');


var app = express();
app.use(express.static(__dirname + '/app')); //set static file location as the public directory
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(logger('dev')); //Log every request

var db = require('./db');
var newick = require('./newick');

/*
  Get structures from the DB. Filter set based on named
  query parameters
*/
app.get(['/api/structures','/ubsrd/api/structures'], function(req, res) {
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
app.get(['/api/structure/:id','/ubsrd/api/structure/:id'], function(req, res) {
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
  Get a ubq residue pair interactions
*/
app.get(['/api/residue_interactions','/ubsrd/api/residue_interactions'], function(req, res) {
  console.log(req.query);
  db.ubq_type_interactions(req.query, function(err, all) {
    console.log(all.length);
    res.json(all);
  });
});

/*
  Get a target id
*/
app.get(['/api/target_types','/ubsrd/api/target_types'], function(req, res) {
  console.log(req.query);
  db.get_target_types(function(err, all) {
    console.log(all.length);
    res.json(all);
  });
});

/*
  Get a chain type
*/
app.get(['/api/chain_types','/ubsrd/api/chain_types'], function(req, res) {
  console.log(req.query);
  db.get_chain_types(function(err, all) {
    console.log(all.length);
    res.json(all);
  });
});

/*
  Get a ubq residue pair interactions
*/

app.get(['/api/residue_interactions','/ubsrd/api/residue_interactions'], function(req, res) {
  console.log(req.query);
  db.ubq_type_interactions(req.query, function(err, all) {
    console.log(all.length);
    res.json(all);
  });
});

/*
  Get the set of interaction types
*/

app.get(['/api/interaction_types','/ubsrd/api/interaction_types'], function(req, res) {
  console.log(req.query);
  db.get_interaction_types(function(err, all) {
    console.log(all.length);
    res.json(all);
  });
});

/*
  Get the set of ubq types
*/
app.get(['/api/ubq_types','/ubsrd/api/ubq_types'], function(req, res) {
  console.log(req.query);
  db.get_ubq_types(function(err, all) {
    console.log(all.length);
    res.json(all);
  });
});


/*
  Retreive the phylogenetic tree in JSON
*/
app.get(['/api/phylo','/ubsrd/api/phylo'], function(req, res) {
  var newick_data = fs.readFileSync('phylo_tree.newick', encoding='utf8');
  res.json(newick.parse(newick_data));
});

/*
  Download the entire database
*/
app.get(['/api/download','/ubsrd/api/download'], function(req, res) {
  res.download(__dirname + '/042016_UBSRD_renum.db3'); 
});

/*
  Download the entire database
*/
app.get(['/api/download_alignment','/ubsrd/api/download_alignment'], function(req, res) {
  res.download(__dirname + ''); 
});

app.get(['/api/example1','/ubsrd/api/example1'], function(req, res) {
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
  res.sendFile(__dirname + '/app/index.html');
});

app.listen(8000)
