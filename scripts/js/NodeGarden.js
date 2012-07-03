define([ "scripts/js/ApplicationBase.js", "scripts/js/NodeGardenComps.js", "scripts/js/Particle.js" ], function( AppBase, GardenComps )
{
	
	var NodeGarden = function()
	{
		// static vars
		var BACKGROUND_COLOUR 	= "#3ba790";
		var COMPS_WIDTH			= "300px";
		var COMPS_HEIGHT		= "100px";
	
		// Class Object
		var _nodeGardenClazz = {};
		var _appBase;
		
		var _context;
		var _canvas;
		
		// partice propertis
		var _numParticles;
		var _maximumGlow 		= 30;
		var _maxParticles 		= 100;
		var _totalParticles     = 30;
		var _friction 			= 1;
		var _particlesArray		= [];
		var _comps;
		
		// comps
		var _tintValue			= 0;
		var _useFilters			= true;
		var _tintChanged		= false;
		
		// set the fill state of the particles
		var _particleFillState	= "";
		
		
	// [  PUBLIC METHODS
		
		/*
		 * init
		 */
		_nodeGardenClazz.init = function( context, canvas )
		{
			// create Base Class
			_appBase = new AppBase(); 			
			
			// set up view elements
			_context 	= context;
			_canvas 	= canvas; 
			_appBase.setCanvas( _canvas );		
			_appBase.setContext( _context );
			
			 // // set animation function
	    	_appBase.setAnimationFunction( springParticles, false );
	    	_appBase.setParticlesArray( _particlesArray );
	    	
	    	 // // create particles
	    	createParticles( _totalParticles );
	    	
	    	// initialise comps
	    	_comps = new GardenComps( ".comps", COMPS_WIDTH, COMPS_HEIGHT, BACKGROUND_COLOUR );
			_comps.setMinDistanceHandler( minimumDistance_handler );
			_comps.setNumParticlesHandler ( numParticles_handler );
			_comps.setGlowHandler ( glowAmount_handler );
			_comps.setColourChoiceHandler( colourChoice_handler );
			_comps.setRemoveColourHandler( removeColour_handler );
			_comps.setGravitateHandler( gravitate_handler ) 	
			_comps.setHaloHandler( halo_handler );
			_comps.setEclipseHandler( eclipse_handler );

			
			// set the comps stats
			_comps.setShowStatsHandler( showStats_handler );
		
	    	
	    	_comps.activetView(); // activate comps
	    	this.startAnimation(); // start animation
		}
		
		/*
		 * Start Animation
		 */
		_nodeGardenClazz.startAnimation = function() { _appBase.startAnimation(); }
		
		/*
		 * Stop animation
		 */
		_nodeGardenClazz.stopAnimation = function() { _appBase.stopAnimation(); }
	
	
		_nodeGardenClazz.dispose = function()
		{
			_appBase.stopAnimation();
			_appBase.dispose();
			_comps.dispose();
			_appBase = null;
			_nodeGardenClazz = null;
		}
		
	// ]
	
	
	// [ PRIVATE METHODS
	
		function createParticles( numParticles ) 
		{
			var size;
			var particle;
			
			for( var i = 0; i < numParticles; i++ )
			{
				size = Math.random() * 20 + 2;
				particle = new Particle( size, Math.random() * 0xFFFFFF, _useFilters );
				particle.x = Math.random() * _canvas.width;
				particle.y = Math.random() * _canvas.height;
				particle.vx = Math.random() * 2 - 1;
				particle.vy = Math.random() * 2 - 1;
				particle.setFillStyle( _particleFillState );
				particle.mass = size;		
				_particlesArray.push( particle ); // populate base app array
			}  
		}
		
		/*
		 * Spring method
		 * spring particles towards eachother when below the min distance, creates a springy attraction
		 */
		function springParticles( particleA , particleB  )
		{
			if( !particleA || !particleB ) return;
			
			var dx = particleB.x - particleA.x;
			var dy = particleB.y - particleA.y;
			var distance  = Math.sqrt( dx * dx + dy * dy );
			
			if( distance < _appBase.minDistance() )
			{
				var ratio = (  distance / _appBase.minDistance() );
				var distAmount = _appBase.tintAmount() - ( ratio * _appBase.tintAmount() ) ;
				
				var colour = _appBase.getColour( particleA, particleB ); // get the colour based on selection
				
				particleA.tint( colour, distAmount ); // tints both particles based on colour
				particleB.tint( colour, distAmount );
// 			
			// creates the line between particle [
				_context.strokeStyle = utils.colorToRGB( colour ? colour : "#ffffff", 1 - ratio ); 
				_context.lineWidth = 1 - ratio;
				_context.beginPath();
				_context.moveTo( particleA.x, particleA.y );
				_context.lineTo( particleB.x, particleB.y );
				_context.stroke();
			// ]
			
				var ax = dx * _appBase.springAmount(); 		// the magic, calculate acceleration. basic spring calculation,
				var ay = dy * _appBase.springAmount(); 		// distance * spring amount
				particleA.vx += ax / particleA.mass; 		// acceleration / particle mass
				particleA.vy += ay / particleA.mass;
				particleB.vx -= ax / particleB.mass;
				particleB.vy -= ay / particleB.mass;
			}
			else
			{
				particleA.removeTint(); // start removing tint
				particleB.removeTint();
			}
		}
		
		
		/*
		 * Gravitate method
		 * instead of springing and compare mass to add to force 
		 */
		function gravitateParticles( particleA , particleB )  
		{
			checkCollision( particleA, particleB );
			
			var dx = particleB.x - particleA.x;
			var dy = particleB.y - particleA.y;
			var distSQ = dx*dx + dy*dy;
			var distance = Math.sqrt(distSQ);
			
			if( distance < _appBase.minDistance() )
			{
				var ratio = (  distance / _appBase.minDistance() );
				var distAmount = _appBase.tintAmount() - ((  distance / _appBase.minDistance() ) * _appBase.tintAmount() ) ;
				
				var colour = _appBase.getColour( particleA, particleB ); 	// get the colour based on selection
				particleA.tint( colour, distAmount ); 						// tints both particles based on colour
				particleA.tint( colour, distAmount );
			
			// creates the line between particle [
				_context.strokeStyle = utils.colorToRGB( colour ? colour : "#ffffff", 1 - ratio ); 
				_context.lineWidth = 1 - ratio;
				_context.beginPath();
				_context.moveTo( particleA.x, particleA.y );
				_context.lineTo( particleB.x, particleB.y );
				_context.stroke();
			// ]
				
				var force  = particleA.mass * particleB.mass / distSQ; 		// calculate force, mass / distance squared
				var ax  = force * dx / distance; 							// the magic, only difference is force from spring aprticle
				var ay  = force * dy / distance;
				particleA.vx += ax / particleA.mass;
				particleA.vy += ay / particleA.mass;
				particleB.vx -= ax / particleB.mass;
				particleB.vy -= ay / particleB.mass;
			}
			else
			{
				particleA.removeTint(); // start removing tint
				particleB.removeTint();
			}
		}
		
		
	/*********************************************************************************
	 * Collision function from
	 * Kieth Peters - Foundation AS Animation
	 */
	
		
		function checkCollision ( particleA, particleB ) 
		{
	        var dx = particleB.x - particleA.x,
	            dy = particleB.y - particleA.y,
	            dist = Math.sqrt(dx * dx + dy * dy);
	        //collision handling code here
	        if (dist < particleA.radius + particleB.radius) {
	          //calculate angle, sine, and cosine
	          var angle = Math.atan2(dy, dx),
	              sin = Math.sin(angle),
	              cos = Math.cos(angle),
	              //rotate particleA's position
	              pos0 = {x: 0, y: 0}, //point
	              //rotate particleB's position
	              pos1 = rotate(dx, dy, sin, cos, true),
	              //rotate particleA's velocity
	              vel0 = rotate(particleA.vx, particleA.vy, sin, cos, true),
	              //rotate particleB's velocity
	              vel1 = rotate(particleB.vx, particleB.vy, sin, cos, true),
	              //collision reaction
	              vxTotal = vel0.x - vel1.x;
	          vel0.x = ((particleA.mass - particleB.mass) * vel0.x + 2 * particleB.mass * vel1.x) /
	                   (particleA.mass + particleB.mass);
	          vel1.x = vxTotal + vel0.x;
	          //update position - to avoid objects becoming stuck together
	          var absV = Math.abs(vel0.x) + Math.abs(vel1.x),
	              overlap = (particleA.radius + particleB.radius) - Math.abs(pos0.x - pos1.x);
	          pos0.x += vel0.x / absV * overlap;
	          pos1.x += vel1.x / absV * overlap;
	          //rotate positions back
	          var pos0F = rotate(pos0.x, pos0.y, sin, cos, false),
	              pos1F = rotate(pos1.x, pos1.y, sin, cos, false);
	          //adjust positions to actual screen positions
	          particleB.x = particleA.x + pos1F.x;
	          particleB.y = particleA.y + pos1F.y;
	          particleA.x = particleA.x + pos0F.x;
	          particleA.y = particleA.y + pos0F.y;
	          //rotate velocities back
	          var vel0F = rotate(vel0.x, vel0.y, sin, cos, false),
	              vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
	          particleA.vx = vel0F.x;
	          particleA.vy = vel0F.y;
	          particleB.vx = vel1F.x;
	          particleB.vy = vel1F.y;
	       }
      }
      function rotate (x, y, sin, cos, reverse) {
        return {
          x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
          y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
        };
      }
      
	//*********************************************************************************

		
		/*
		 * remove the filters from every particle
		 */
		function stopFilters( useFilters )
		{
			_nodeGardenClazz.stopAnimation(); // stop animation
			
			var i = _particlesArray.length;
			var particle;
			while( --i > -1 )
			{
				particle = _particlesArray[ i ];
				particle.useFilters( useFilters );
			}
			
			_useFilters = useFilters;
			_nodeGardenClazz.startAnimation(); // start animation
		}
		
	// ]
	
// -------------------------------------- [ PRIVATE METHODS ] ----------------------------------- //	
	
	// [ COMPS HANDLERS
		
		/*
		 * change the minimum distance
		 */
		function minimumDistance_handler( event ) 
		{ 
			_appBase.setMinDistance( Math.round( event.getValue() ) );
		};
		
		/*
		 * add or remove particles
		 */
		function numParticles_handler( event ) 
		{
			var value 			= event.getValue();
			var arrayLength		= _particlesArray.length;
			
			if( value > arrayLength ) // create more
			{
				createParticles( Math.abs( arrayLength - value ) );
			}
			else
			{
				if( arrayLength === 0 ) // stop this being called when there are no more eparticles
				{
					partArray = [];
					return;
				}
				
				var i = arrayLength;
				var particle;
				
				while( --i > ( value - 1 ) )
				{
					particle = _particlesArray[ i ];
					if( particle ) particle.dispose();
					_particlesArray.splice( i, 1 );
					particle = null;
				}
			}
			
		};
		/*
		 * add or remove glow
		 */
		function glowAmount_handler( event ) 
		{
			if( _tintValue == Math.round( event.getValue() ) ) return;
			
			_tintValue = Math.round( event.getValue() );
			_appBase.setTintAmount( _tintValue );
			
			if( _tintValue <= 0 ) { stopFilters( false ); _tintChanged = true; }  // add or remove filters from particles
			else if ( _tintValue === 1 && _tintChanged ) { stopFilters( true ); _tintChanged = false; } 
		};
		/*
		 * change colouring
		 */
		function colourChoice_handler( event ) 
		{
			_appBase.getStrongest( event.getSelected() );
		};
		/*
		 * remove colour all together
		 */
		function removeColour_handler( event ) 
		{
			_appBase.dontMixColours( event.getSelected() );
		};
		/*
		 * change animation function to gravitate
		 */
		function gravitate_handler( event ) 
		{
			var value = event.getSelected();
			_appBase.setAnimationFunction( ( value )? gravitateParticles : springParticles, true );
		};
		// pass in the stats from comps
		function showStats_handler( stats ) { _appBase.setStats( stats ) }
		
		// halo handler
		function halo_handler( event ) 
		{ 
			_particleFillState = ( event.getSelected() ) ? "haloFill" : "regulareFill"; 
			refreshParticleViewState();
		}
		// eclispe handler
		function eclipse_handler( event ) 
		{ 
			_particleFillState = ( event.getSelected() ) ? "eclipseFill" : "regulareFill"; 
			refreshParticleViewState();
		}
		
		/*
		 * refresh particle view
		 */
		function refreshParticleViewState()  
		{
			
			_nodeGardenClazz.stopAnimation(); // stop animation

			var arrayLength		= _particlesArray.length;
			var i = arrayLength;
			var particle;
			while( --i > -1 )
			{
				particle = _particlesArray[ i ];
				particle.setFillStyle( _particleFillState )
			}
			_nodeGardenClazz.startAnimation(); // start animation
		}
		
		
	// ] 
	
		// return CLAZZ OBJECT
		return _nodeGardenClazz;
	}
	// return MODULE CLASS
	return NodeGarden;
	
})
