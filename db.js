var sqlite = require('sqlite3');
var db = new sqlite.Database('092014_UBSRD.db3');

exports.get_structures = function(options, callback) {
  var query = [
  'SELECT * FROM structures s',
  'JOIN interaction_type i ON',
  ' s.struct_id = i.struct_id'
  ];
  if(options.interaction_types || options.pdb_codes || options.ubl_types) {
    query.push('WHERE');
  }

  if(options.interaction_types) {
    if(query[query.length - 1] != 'WHERE') {
      query.push('AND');
    }
    query.push('(');
    for (var i = 0, len = options.interaction_types.length; i < len; i++) {
      var inter_type = options.interaction_types[i];
      query.push('i.inter_type = "' + inter_type + '"');
      query.push('OR');
    }
    query.pop();
    query.push(')');
  }

  if(options.ubl_types) {
    if(query[query.length - 1] != 'WHERE') {
      query.push('AND');
    }
    query.push('(');
    for (var i = 0, len = options.ubl_types.length; i < len; i++) {
      var ubl_type = options.ubl_types[i];
      query.push('i.ubl_type = "' + ubl_type + '"');
      query.push('OR');
    }
    query.pop();
    query.push(')');
  }

  if(options.pdb_codes) {
    for (var i = 0, len = options.pdb_codes.length; i < len; i++) {
      var pdb_code = options.pdb_codes[i].substring(0,4);
      query.push('i.pdb_code = "' + pdb_code + '"');
      query.push('OR');
    }
    query.pop();
  }

  //Join it all together
  query = query.join(' ');

  console.log(query);
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
};

exports.structure_by_id = function(struct_id, callback) {
  var query = [
  'SELECT * FROM structures s',
  'JOIN interaction_type i ON',
  ' s.struct_id = i.struct_id',
  'WHERE',
    's.struct_id = ?'
  ].join(' ');
  db.all(query, struct_id,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
}

exports.example1 = function(callback) {
  var query = "select i.inter_type as inter_type, count(*) as count from structures s join interaction_type i on s.struct_id = i.struct_id GROUP BY i.inter_type;"; 
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
};

