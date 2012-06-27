define( [ 'scripts/js/helper/utils.js' ], function() 
{
	// define the returned class
	var ApplicationBase = function()
	{
		// create clazz return object
		var appBaseClazz = { };
		
		// private properies
		var _canvas;
		var _context;
		var _animRequest;
		var _moveParticles;
		var _animationFunction;
		var _render;
		var _stats;
		var _particlesArray;
		
		// initial values
		var _dontMixColours		= false;
		var _getStrongest		= true;
		var _tintAmount			= 10;
		var _minDistance		= 100;
		var _springAmount		= 0.0002; 
		var _animating			= false;
		
		
		
	// [ GETTERS AND SETTERS 
	
		// canvas
		appBaseClazz.canvas = function( ){ return _canvas }
		appBaseClazz.setCanvas = function( canvas ) { _canvas = canvas; } 
		// context
		appBaseClazz.context = function() { return _context; }
		appBaseClazz.setContext = function( context ) { _context = context; }  
		// tine amount
		appBaseClazz.tintAmount = function() { return _tintAmount }
		appBaseClazz.setTintAmount = function( tint ) { _tintAmount = tint; }
		// min distance
		appBaseClazz.minDistance = function() { return _minDistance; }
		appBaseClazz.setMinDistance = function( minDistance ) { _minDistance = minDistance; }
		// spring amount
		appBaseClazz.springAmount = function() { return _springAmount; }
		appBaseClazz.setSpringAmount = function( spring ) { _springAmount = spring; }
		// change colour method
		appBaseClazz.getStrongest = function( value ) { _getStrongest = value; }
		// remove colouring
		appBaseClazz.dontMixColours = function( value ) { _dontMixColours = value; }
		// return new particles array of one does not exist
		appBaseClazz.particlesArray = function() 
		{ 
			if( !_particlesArray ) _particlesArray = []; 
			return _particlesArray; 
		}
		// set the array
		appBaseClazz.setParticlesArray = function( array ) { _particlesArray = array; }
		// set stats
		appBaseClazz.setStats = function( stats ) {  _stats = stats; };
		// resizing
		appBaseClazz.resize_handler = function( canvas ) {};
		
		
	// ] 	
	
	// [ PUBLIC METHODS 
	
		/*
		 * get the colour calculated based on particles and methods in utils
		 */
		appBaseClazz.getColour = function( particle1, particle2 )
		{
			if( _dontMixColours ) return null;
				else return ( _getStrongest ) ? utils.strongestColour( particle1.getStaticColour(), particle2.getStaticColour() ) : 
											utils.CombineColours( particle1.getStaticColour(), particle2.getStaticColour() ) ;
		}
	
		/*
		 * start animation
		 */
		appBaseClazz.startAnimation = function()
		{
			if( _animating ) return;
			if( !_moveParticles ) _moveParticles = moveParticles; // assign the move particles function if one is not defined
			if( !_particlesArray || _particlesArray.length < 1 ) return; // stop if particle array is not populated or defined
			
			animate();
			_animating = true;
		}
		
		/*
		 * stop animation
		 */
		appBaseClazz.stopAnimation = function() 
		{ 
			window.cancelRequestAnimationFrame( _animRequest ); 
			_context.clearRect( 0, 0, _canvas.width, _canvas.height );
			_animating = false;
		}
	
		/*
		 * set the animatiion callback function
		 */
		appBaseClazz.setAnimationFunction = function( callback, startAfterSetting ) 
		{ 
			this.stopAnimation();
			if( _animationFunction ) _animationFunction = null;
			_animationFunction = callback; 
			if( startAfterSetting ) this.startAnimation();
		}
		
		/*
		 * set th render function
		 */
		appBaseClazz.setRender = function( value ) { _render = value; }
		
		/*
		 * set the move particle function
		 */
		appBaseClazz.setMovementFunction = function( moveParticlesFunction ) 
		{
			if( _moveParticles ) _moveParticles = null;
			 _moveParticles = moveParticlesFunction; 
		}
		
	// ] 
		
		
	// [ PRIVATE METHODS
		
		
		// loop through and move particles in array
		function moveParticles()
		{
			var particle;
			var i = _particlesArray.length;
			while( --i > -1 )
			{
				particle = _particlesArray[ i ];
				particle.x += particle.vx;
				particle.y += particle.vy;
				chekBounds( particle );
			}
			
			var j = _particlesArray.length;
			var k;
			var particleA;
			var particleB;
			while( --j > -1 )
			{
				k = j;
				while( --k > -1 )
				{
					 particleA = _particlesArray[ j ];
					 particleB = _particlesArray[ k ];
			     	 _animationFunction( particleA, particleB );
				}
			}
		}
		
		// draw canvas each loop
		function drawCanvas( particle ) { particle.draw( _context ); }
		
		// animate
		function animate() 
		{
			_animRequest = requestAnimationFrame( animate );
			draw();
		}
		
		// draw the view each frame
		function draw()
		{
			if( _stats ) _stats.begin(); // wrap in stats
			
				_context.clearRect( 0, 0, _canvas.width, _canvas.height );
				_moveParticles(); 	// move particles
				// _particlesArray.forEach( _moveParticles ); 	
			    _particlesArray.forEach( drawCanvas ); 		// darwCanvas 
		    
		    if( _stats ) _stats.end(); // end stats
		}
		
		
		// check particle bounds
		function chekBounds( particle ) 
		{
			var halfRadius  = particle.radius / 2;
			
			if( particle.x < ( - halfRadius ) )
			{
				particle.x = ( _canvas.width + halfRadius );
			}
			else if( particle.x > ( _canvas.width + halfRadius ) )
			{
				particle.x = ( -halfRadius );
			}
			if( particle.y < ( -halfRadius ) )
			{
				particle.y = ( _canvas.height - halfRadius );
			}
			else if ( particle.y > ( _canvas.height + halfRadius ) )
			{
				particle.y = ( -halfRadius );
			}
		}
		
		/*
		 * dispose
		 */
		appBaseClazz.dispose = function()
		{
			this.stopAnimation();
			
			var i = _particlesArray.length;
			var particle;
			
			while( --i > -1 )
			{
				particle = _particlesArray[ i ];
				particle.dispose();
				particle = null;
				_particlesArray.splice( i, 1 );
			}
			
			_context.clearRect( 0, 0, _canvas.width, _canvas.height );
			// nullify vars
			_particlesArray 	= null;
			_tintAmount			= null;
			_minDistance		= null;
			_springAmount		= null;
			_moveParticles		= null;
		}
	
		// RETURN OBJECT
		return appBaseClazz;
	}
	
	// RETURN CLASS 
	return ApplicationBase;
 });
 
 
 
