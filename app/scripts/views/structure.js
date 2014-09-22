define(['backbone', 'glmol', 'text!templates/structure.html'], function(Backbone, GLmol, Template) {

	var Structure = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {},

		render: function(){
			var el = this.$el;

			//Render the template
			el.html( this.template( this.model ) );

			//Initialize glmol. This should belong in the initailize function, but GLMol requires the DOM elements
			//to exist prior to initializing the instance
			var glmol = new GLmol('glmol', true);
			glmol.defineRepresentation = function() {
			   var all = this.getAllAtoms();
			   var hetatm = this.removeSolvents(this.getHetatms(all));
			   this.colorByAtom(all, {});
			   this.colorByChain(all);
			   var asu = new THREE.Object3D();

			   //this.drawBondsAsStick(asu, hetatm, this.cylinderRadius, this.cylinderRadius);
			   //this.drawBondsAsStick(asu, this.getResiduesById(this.getSidechains(this.getChain(all, ['A'])), [58, 87]), this.cylinderRadius, this.cylinderRadius);
			   //this.drawBondsAsStick(asu, this.getResiduesById(this.getSidechains(this.getChain(all, ['B'])), [63, 92]), this.cylinderRadius, this.cylinderRadius);
			   this.drawCartoon(asu, all, this.curveWidth, this.thickness);

			   //this.drawSymmetryMates2(this.modelGroup, asu, this.protein.biomtMatrices);
			   this.modelGroup.add(asu);
			};

			//For now, fetch the PDB from source and load it up
			$.get('http://www.rcsb.org/pdb/files/'+this.model.PDB+'.pdb', function(ret) {			
				el.find('#glmol_src').val(ret);
				glmol.loadMolecule();
			});
  		}

	});

	return Structure;
});