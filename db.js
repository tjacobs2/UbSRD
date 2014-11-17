var sqlite = require('sqlite3');
var db = new sqlite.Database('092014_UBSRD.db3');

exports.all_structures = function(callback) {
  db.all('Select * from structures s join interaction_type i on s.struct_id = i.struct_id join pose_conformations pc on s.struct_id = pc.struct_id', function(err, all) {
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
};

exports.structures_by_interaction_type = function(group_id, callback) {
  var query = [
  'SELECT * FROM structures s',
  'JOIN interaction_type i ON',
  ' s.struct_id = i.struct_id',
  'WHERE',
    'i.inter_type = ?'
  ].join(' ');
  db.all(query, group_id,
    function(err, all) {
        if(err)
          console.error(err);
        callback(err, all);
      });
};

exports.structures_by_ubl_type = function(ubl_id, callback) {
  var query = [
  'SELECT * FROM structures s',
  'JOIN interaction_type i ON',
  ' s.struct_id = i.struct_id',
  'WHERE',
    'i.ubl_type = ?'
  ].join(' ');
  db.all(query, ubl_id,
    function(err, all) {
        if(err)
          console.error(err);
        callback(err, all);
      });
};

exports.structure_by_pdb_codes = function(pdb_codes, callback) {
  var query = [
  'SELECT * FROM structures s',
  'JOIN interaction_type i ON',
  ' s.struct_id = i.struct_id',
  'WHERE',
  ].join(' ');
  for (var i = 0, len = pdb_codes.length; i < len; i++) {
    pdb_code = pdb_codes[i].substring(0,4)
    query += ' i.pdb_code = "' + pdb_code + '" OR';
  }
  query = query.substring(0, query.length-3);
  console.log(query);
  db.all(query,
    function(err, all) {
        if(err)
          console.error(err);
        callback(err, all);
      });
};

exports.example1 = function(callback) {
  db.all(
    'Select * from structures s join pose_conformations c on s.struct_id = c.struct_id join pdb_info pi on substr(tag,1,4) = pi.pdb where pi.inter_type = ?;',
    group_id,
    function(err, all) {
        if(err)
          console.error(err);
        callback(err, all);
      });
};
