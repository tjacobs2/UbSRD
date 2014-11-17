--.header on
SELECT 
it.pdb_code AS pdb, uc.chain_id AS ubq_chain,
rpi1.pdb_residue_number AS tar_res, rpi1.chain_id AS tar_chain, r1.name3 AS tar_name3, 
un.real AS ubq_res, 
rpi2.chain_id AS ubq_chain, r2.name3 AS ubq_name3,
rp.actcoord_dist AS distance,
sss.dssp AS partner_dssp,
it.ubl_type AS ubl_type, 
uc.inter_type AS inter_type

FROM ubq_chains uc 

JOIN residue_pdb_identification rpi1 ON
    uc.struct_id = rpi1.struct_id AND
    rpi1.chain_id NOT IN (SELECT uc2.chain_id FROM ubq_chains uc2 WHERE uc2.struct_id = rpi1.struct_id)

JOIN residues r1 ON
    r1.struct_id = uc.struct_id AND
    r1.resNum = rpi1.residue_number

JOIN residue_pdb_identification rpi2 ON
    uc.struct_id = rpi2.struct_id AND
    rpi2.chain_id = uc.chain_id

JOIN residues r2 ON
    r2.struct_id = uc.struct_id AND
    r2.resNum = rpi2.residue_number

JOIN ubq_numbering un ON 
    rpi2.pdb_residue_number = un.renum

JOIN residue_pairs rp ON
    uc.struct_id = rp.struct_id AND
    ((rpi1.chain_id = uc.chain_id AND rpi2.chain_id != uc.chain_id) OR
    (rpi1.chain_id != uc.chain_id AND rpi2.chain_id = uc.chain_id)) AND
    ((rpi1.residue_number = rp.resNum1 AND rpi2.residue_number = rp.resNum2) OR
    (rpi1.residue_number = rp.resNum2 AND rpi2.residue_number = rp.resNum1))

 JOIN interaction_type it ON
 uc.struct_id = it.struct_id
 
 JOIN secondary_structure_segments sss ON
 uc.struct_id = sss.struct_id
 AND
 (rpi1.residue_number BETWEEN sss.residue_begin AND sss.residue_end)

 WHERE
 rp.actcoord_dist < 6
 AND
--UBL residue type
 it.ubl_type = 'UBQ'
 AND
-- protein-protein interaction type
 (uc.inter_type = 'NC' OR uc.inter_type = 'DB' OR uc.inter_type = 'CJ')
 --AND
-- partner residue type

-- (r1.name3 = 'ALA' OR r1.name3 = 'ASP' OR r1.name3 = 'ASN' OR r1.name3 = 'ARG' OR r1.name3 = 'CYS' OR r1.name3 = 'GLN'
--OR r1.name3 = 'GLU' OR r1.name3 = 'GLY' OR r1.name3 = 'HIS' OR r1.name3 = 'ILE'  OR 
--r1.name3 = 'GLN'
--OR r1.name3 = 'LYS' OR r1.name3 = 'MET' OR r1.name3 = 'PHE' OR r1.name3 = 'PRO' OR r1.name3 = 'SER' OR r1.name3 = 'THR'
--OR r1.name3 = 'TRP' OR r1.name3 = 'TYR' OR r1.name3 = 'VAL')
    AND

--UBQ residue type (unnecessary I think)
 (r2.name3 = 'ALA' OR r2.name3 = 'ASP' OR r2.name3 = 'ASN' OR r2.name3 = 'ARG' OR r2.name3 = 'CYS' OR r2.name3 = 'GLN'
 OR r2.name3 = 'GLU' OR r2.name3 = 'GLY' OR r2.name3 = 'HIS' OR r2.name3 = 'ILE'  OR r2.name3 = 'LEU'
 OR r2.name3 = 'LYS' OR r2.name3 = 'MET' OR r2.name3 = 'PHE' OR r2.name3 = 'PRO' OR r2.name3 = 'SER' OR r2.name3 = 'THR'
 OR r2.name3 = 'TRP' OR r2.name3 = 'TYR' OR r2.name3 = 'VAL')
AND

--UBQ residue number
un.real = '70'

;
                           
