var sqlite = require('sqlite3');
var db = new sqlite.Database('042016_UBSRD_renum.db3');

exports.get_interaction_types = function(callback) {
  var query = "SELECT * FROM ppi_id"
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
};

exports.get_ubq_types = function(callback) {
  var query = "SELECT * FROM ubl_id"
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
};


exports.get_target_types = function(callback) {
  var query = "SELECT * FROM target_id"
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
};

exports.get_chain_types = function(callback) {
  var query = "SELECT * FROM chain_id"
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
};



exports.get_structures = function(options, callback) {
  var query = [
  'SELECT * FROM interaction_type i',
  'JOIN structures s ON',
  ' s.struct_id = i.struct_id',

  ];
  if(options.interaction_types || options.pdb_codes || options.ubl_types || options.target_types || options.chain_types) {
    query.push('WHERE');
  }

  if(options.interaction_types) {
    if(query[query.length - 1] != 'WHERE') {
      query.push('AND');
    }
    query.push('(');
    for (var i = 0, len = options.interaction_types.length; i < len; i++) {
      var inter_type = options.interaction_types[i];
      query.push('i.ppi_id = ' + inter_type);
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
      query.push('i.ubl_id = ' + ubl_type);
      query.push('OR');
    }
    query.pop();
    query.push(')');
  }
  
  if(options.target_types) {
    if(query[query.length - 1] != 'WHERE') {
      query.push('AND');
    }
    query.push('(');
    for (var i = 0, len = options.target_types.length; i < len; i++) {
      var target_type = options.target_types[i];
      query.push('i.target_id = ' + target_type);
      query.push('OR');
	}
    query.pop();
    query.push(')');
  }

  if(options.chain_types) {
    if(query[query.length - 1] != 'WHERE') {
      query.push('AND');
    }
    query.push('(');
    for (var i = 0, len = options.chain_types.length; i < len; i++) {
      var chain_type = options.chain_types[i];
      query.push('i.chain_id = ' + chain_type);
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
  console.log(struct_id);
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

/*
  Get residues interacting with certain residues interactions
*/
exports.ubq_type_interactions = function(options, callback) {
console.log("TEST");
console.log(options.ubl_type);
if (options.ubl_type == 1) {
	var query = [
"SELECT ",
"    uc.struct_id as struct_id, ",
"    uc.inter_type AS inter_type, ",
"    it.ubl_type AS ubl_type, ",
"    it.pdb_code AS pdb_code,",
"    uc.chain_letter AS ubq_chain, ",
"    rpi1.pdb_residue_number AS partner_res, ",
"    rpi1.chain_id AS partner_chain, ",
"    rpi1.real_pdb_numbering AS real_partner_num, ",   
"    rpi2.real_pdb_numbering AS real_ubq_num, ",
"	 r1.name3 AS partner_name3, ",
"    un.real AS ubq_res, ",
"    rpi2.chain_id AS ubq_chain, ",
"    r2.name3 AS ubq_name3, ",
"    rp.actcoord_dist AS distance, ",
"    sss.dssp AS partner_dssp, ",
"    cjt.target_type AS cj_tar, ", 
"	 dbt.dub_class AS db_class, ",
"	 dbt.dub AS db_tar",
"FROM ubq_chains uc ",
"",
"JOIN residue_pdb_identification rpi1 ON",
"    uc.struct_id = rpi1.struct_id AND" ,
"    rpi1.ubq_chain_id = ''",
"",
"JOIN residues r1 ON",
"    r1.struct_id = uc.struct_id AND",
"    r1.resNum = rpi1.residue_number",
"",
"JOIN residue_pdb_identification rpi2 ON",
"    uc.struct_id = rpi2.struct_id AND",
"    rpi2.ubq_chain_id = uc.chain_id AND",
"    rpi2.ubq_chain_id != '' ",
"",
"JOIN residues r2 ON",
"    r2.struct_id = uc.struct_id AND",
"    r2.resNum = rpi2.residue_number",
"",
"JOIN ubq_numbering un ON",
"    rpi2.pdb_residue_number = un.renum",
"",
"JOIN residue_pairs rp ON",
"    uc.struct_id = rp.struct_id AND",
"    ((rpi1.residue_number = rp.resNum1 AND rpi2.residue_number = rp.resNum2) OR",
"    (rpi1.residue_number = rp.resNum2 AND rpi2.residue_number = rp.resNum1))",
"",
" JOIN interaction_type it ON",
" uc.struct_id = it.struct_id",
"",
" JOIN secondary_structure_segments sss ON",
" uc.struct_id = sss.struct_id",
" AND",
" (rpi1.residue_number BETWEEN sss.residue_begin AND sss.residue_end)",
"",
"LEFT OUTER JOIN cj_type cjt ON",
"    uc.struct_id = cjt.struct_id",
"",
"LEFT OUTER JOIN db_type dbt ON",
"    uc.struct_id = dbt.struct_id",    
"",
" WHERE",
" rp.actcoord_dist < 6",
" AND",
" (uc.inter_type = 'NC' OR uc.inter_type = 'DB' OR uc.inter_type = 'CJ')",
" AND",
" (r1.name3 = 'ALA' OR r1.name3 = 'ASP' OR r1.name3 = 'ASN' OR r1.name3 = 'ARG' OR r1.name3 = 'CYS' OR r1.name3 = 'GLN'",
" OR r1.name3 = 'GLU' OR r1.name3 = 'GLY' OR r1.name3 = 'HIS' OR r1.name3 = 'ILE'  OR r1.name3 = 'LEU'",
" OR r1.name3 = 'LYS' OR r1.name3 = 'MET' OR r1.name3 = 'PHE' OR r1.name3 = 'PRO' OR r1.name3 = 'SER' OR r1.name3 = 'THR'",
" OR r1.name3 = 'TRP' OR r1.name3 = 'TYR' OR r1.name3 = 'VAL')",
"    AND",
" (r2.name3 = 'ALA' OR r2.name3 = 'ASP' OR r2.name3 = 'ASN' OR r2.name3 = 'ARG' OR r2.name3 = 'CYS' OR r2.name3 = 'GLN'",
" OR r2.name3 = 'GLU' OR r2.name3 = 'GLY' OR r2.name3 = 'HIS' OR r2.name3 = 'ILE'  OR r2.name3 = 'LEU'",
" OR r2.name3 = 'LYS' OR r2.name3 = 'MET' OR r2.name3 = 'PHE' OR r2.name3 = 'PRO' OR r2.name3 = 'SER' OR r2.name3 = 'THR'",
" OR r2.name3 = 'TRP' OR r2.name3 = 'TYR' OR r2.name3 = 'VAL') "
  ];

  if(options.ubq_nums) {
    query.push(' AND (');
    for (var i = 0, len = options.ubq_nums.length; i < len; i++) {
      var num = options.ubq_nums[i];
      query.push('un.real = '+ num);
      query.push(' OR ');
    }
    query.pop();
    query.push(')');
  }

  query = query.join(' ');
  console.log(query);
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
}

else if (options.ubl_type == 2) {
	console.log("Got into second");
	var query = [
"SELECT ",
"    uc.struct_id as struct_id, ",
"    uc.inter_type AS inter_type, ",
"    it.ubl_type AS ubl_type, ",
"    it.pdb_code AS pdb_code,",
"    uc.chain_letter AS ubq_chain, ",
"    rpi1.pdb_residue_number AS partner_res, ",
"    rpi1.chain_id AS partner_chain, ",
"    rpi1.real_pdb_numbering AS real_partner_num, ",   
"    rpi2.real_pdb_numbering AS real_ubq_num, ",
"    r1.name3 AS partner_name3, ",
"    un.real AS ubq_res, ",
"    rpi2.chain_id AS ubq_chain, ",
"    r2.name3 AS ubq_name3, ",
"    rp.actcoord_dist AS distance, ",
"    sss.dssp AS partner_dssp, ",
"    cjt.target_type AS cj_tar, ", 
"	 dbt.dub_class AS db_class, ",
"    dbt.dub AS db_tar",
"    rpi2.real_pdb_numbering AS real_ubq_num, ",
"FROM sumo_chains uc ",
"",
"JOIN residue_pdb_identification rpi1 ON",
"    uc.struct_id = rpi1.struct_id AND" ,
"    rpi1.ubq_chain_id = ''",
"",
"JOIN residues r1 ON",
"    r1.struct_id = uc.struct_id AND",
"    r1.resNum = rpi1.residue_number",
"",
"JOIN residue_pdb_identification rpi2 ON",
"    uc.struct_id = rpi2.struct_id AND",
"    rpi2.sumo_chain_id = uc.chain_id AND",
"    rpi2.sumo_chain_id != '' ",
"",
"JOIN residues r2 ON",
"    r2.struct_id = uc.struct_id AND",
"    r2.resNum = rpi2.residue_number",
"",
"JOIN sumo_numbering un ON",
"    rpi2.pdb_residue_number = un.renum",
"",
"JOIN residue_pairs rp ON",
"    uc.struct_id = rp.struct_id AND",
"    ((rpi1.residue_number = rp.resNum1 AND rpi2.residue_number = rp.resNum2) OR",
"    (rpi1.residue_number = rp.resNum2 AND rpi2.residue_number = rp.resNum1))",
"",
" JOIN interaction_type it ON",
" uc.struct_id = it.struct_id",
"",
" JOIN secondary_structure_segments sss ON",
" uc.struct_id = sss.struct_id",
" AND",
" (rpi1.residue_number BETWEEN sss.residue_begin AND sss.residue_end)",
"",
"LEFT OUTER JOIN cj_type cjt ON",
"    uc.struct_id = cjt.struct_id",
"",
"LEFT OUTER JOIN db_type dbt ON",
"    uc.struct_id = dbt.struct_id",    
"",
" WHERE",
" rp.actcoord_dist < 6",
" AND",
" (uc.inter_type = 'NC' OR uc.inter_type = 'DB' OR uc.inter_type = 'CJ')",
" AND",
" (r1.name3 = 'ALA' OR r1.name3 = 'ASP' OR r1.name3 = 'ASN' OR r1.name3 = 'ARG' OR r1.name3 = 'CYS' OR r1.name3 = 'GLN'",
" OR r1.name3 = 'GLU' OR r1.name3 = 'GLY' OR r1.name3 = 'HIS' OR r1.name3 = 'ILE'  OR r1.name3 = 'LEU'",
" OR r1.name3 = 'LYS' OR r1.name3 = 'MET' OR r1.name3 = 'PHE' OR r1.name3 = 'PRO' OR r1.name3 = 'SER' OR r1.name3 = 'THR'",
" OR r1.name3 = 'TRP' OR r1.name3 = 'TYR' OR r1.name3 = 'VAL')",
"    AND",
" (r2.name3 = 'ALA' OR r2.name3 = 'ASP' OR r2.name3 = 'ASN' OR r2.name3 = 'ARG' OR r2.name3 = 'CYS' OR r2.name3 = 'GLN'",
" OR r2.name3 = 'GLU' OR r2.name3 = 'GLY' OR r2.name3 = 'HIS' OR r2.name3 = 'ILE'  OR r2.name3 = 'LEU'",
" OR r2.name3 = 'LYS' OR r2.name3 = 'MET' OR r2.name3 = 'PHE' OR r2.name3 = 'PRO' OR r2.name3 = 'SER' OR r2.name3 = 'THR'",
" OR r2.name3 = 'TRP' OR r2.name3 = 'TYR' OR r2.name3 = 'VAL')"
  ];

  if(options.ubq_nums) {
    query.push(' AND (');
    for (var i = 0, len = options.ubq_nums.length; i < len; i++) {
      var num = options.ubq_nums[i];
      query.push('un.real = '+ num);
      query.push(' OR ');
    }
    query.pop();
    query.push(')');
  }

  query = query.join(' ');
  console.log(query);
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
}}

exports.example1 = function(callback) {
  var query = "select i.inter_type as inter_type, count(*) as count from structures s join interaction_type i on s.struct_id = i.struct_id GROUP BY i.inter_type;"; 
  db.all(query,
    function(err, all) {
      if(err)
        console.error(err);
      callback(err, all);
  });
};

