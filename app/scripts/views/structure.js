define([
	'backbone',
	'glmol',
	'text!templates/structure.html',
	'models/structure'
], function(
	Backbone,
	GLmol,
	Template,
	Structure
) {
	var StructureView = Backbone.View.extend({

		template: _.template(Template),

		initialize: function(options) {
			console.log('initializing');
			this.options = options;
			_.bindAll(this, 'show_structure');
		},

		render: function(){
			console.log('rendering');
	    	var structure = new Structure({struct_id: this.options.struct_id});
	    	structure.fetch({
	    		success: this.show_structure
	    	});
	    },

	    show_structure: function(structure) {
			//Render the template
			//el.html( this.template( this.model ) );
			//this.$el.html( this.template( model ) );
			console.log(structure);
			this.$el.html( this.template( structure.attributes ) );

			//Initialize glmol. This should belong in the initailize function, but GLMol requires the DOM elements
			//to exist prior to initializing the instance
			var self = this;
			var glmol = new GLmol('glmol', true);
			glmol.defineRepresentation = function() {
				console.log(self.options);
				var all = this.getAllAtoms();
				var hetatm = this.removeSolvents(this.getHetatms(all));
				this.colorByAtom(all, {});
				this.colorByChain(all);
				var asu = new THREE.Object3D();

			   //this.drawBondsAsStick(asu, hetatm, this.cylinderRadius, this.cylinderRadius);
			   //this.drawBondsAsStick(asu, this.getResiduesById(this.getSidechains(this.getChain(all, ['A'])), [58, 87]), this.cylinderRadius, this.cylinderRadius);
			   //this.drawBondsAsStick(asu, this.getResiduesById(this.getSidechains(this.getChain(all, ['B'])), [63, 92]), this.cylinderRadius, this.cylinderRadius);
			// console.log(structure.attributes.partner_chain);		
			// console.log(structure.attributes.partner_res);	
				if(self.options.ubq_chain && self.options.ubq_res){
					console.log('BONDS');
					console.log(self.options.ubq_chain);
					console.log(self.options.ubq_res);
					this.drawBondsAsStick(asu, this.getResiduesById(this.getSidechains(this.getChain(all, [self.options.ubq_chain])), [parseInt(self.options.ubq_res)]), this.cylinderRadius, this.cylinderRadius);
					this.drawBondsAsStick(asu, this.getResiduesById(this.getSidechains(this.getChain(all, [self.options.partner_chain])), [parseInt(self.options.partner_res)]), this.cylinderRadius, this.cylinderRadius);
				}
				this.drawCartoon(asu, all, this.curveWidth, this.thickness);

				//this.drawSymmetryMates2(this.modelGroup, asu, this.protein.biomtMatrices);
				this.modelGroup.add(asu);
			};

			//For now, fetch the PDB from source and load it up
			var url = 'http://www.rcsb.org/pdb/files/'+structure.attributes.pdb_code+'.pdb';
			console.log('PDB URL: ' + url);
			$.get(url, function(ret) {			
				//$('#glmol_src').html(ret);
				$('#glmol_src').val(ret);
				glmol.loadMolecule();
			});
  		}

	});

	return StructureView;
});
