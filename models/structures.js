var sqlite = require('sqlite3');
var db = new sqlite.Database('UBSRD.db3');

//CREATE TABLE pose_conformations(
//        struct_id INTEGER NOT NULL,
//        annotated_sequence TEXT,
//        total_residue INTEGER,
//        fullatom INTEGER,
//        FOREIGN KEY (struct_id) REFERENCES structures(struct_id) DEFERRABLE INITIALLY DEFERRED);

exports.all_structures = function(callback) {
  db.all('Select * from structures s join pose_conformations c on s.struct_id = c.struct_id join pdb_info pi on substr(tag,1,4) = pi.pdb;', function(err, all) {
    if(err)
      console.error(err);
    callback(err, all);
  });
};

exports.structure_by_id = function(struct_id, callback) {
  db.all('Select * from structures s join pose_conformations c on s.struct_id = c.struct_id join pdb_info pi on substr(tag,1,4) = pi.pdb where s.struct_id = ?;',
    struct_id,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
};

exports.group_structures = function(group_id, callback) {
  db.all('Select * from structures s join pose_conformations c on s.struct_id = c.struct_id join pdb_info pi on substr(tag,1,4) = pi.pdb where pi.inter_type = ?;',
    group_id,
    function(err, all) {
        if(err)
          console.error(err);
        callback(err, all);
      });
};
