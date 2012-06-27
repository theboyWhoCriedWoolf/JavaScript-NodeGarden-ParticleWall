// load in with required js files, get application base object passed in
define([ "scripts/js/ApplicationBase.js", "scripts/js/ParticleWallComps.js", "scripts/js/Particle.js"  ] , function ( AppBase, ParticleComps ) 
{
	
	/*
	 * Class
	 */
	var ParticleWall = function()
	{
		
		// static vars
		var BACKGROUND_COLOUR 	= "#3ba790";
		var COMPS_WIDTH			= "625px";
		var COMPS_HEIGHT		= "40px";
	
		// define the nodegarden object
		var particleWallClazz = {};
		
		// private properties
		var _context;
		var _canvas;
		
		var _appBase;
		var _comps;
		
		var _columns;
		var _rows;
		var _particleMass = 10;
		var _particleRadius = 10;
		var _particleMagin = 10;
		var _friction = 1;
		var _mouseMass = 50;
		var _speedUp = false	
		var _eyeCount = 0;
		var _halfStage;
		var _mouseX;
		var _mouseY;
		var _doubleRadius;
		var _totalParticles;
		var _points;
		var _viewModeHandler;
		
		// comps
		var _currentRadius = 0;
		
		
		particleWallClazz.init = function( context, canvas )
		{
			// instantiate app base
			_appBase 	= new AppBase();
				
			_context 	= context;
			_canvas 	= canvas;
			_appBase.setCanvas( _canvas );		
			_appBase.setContext( _context );
			
			// set double radius, used to align particles
			_doubleRadius = ( _particleRadius * 2  );
			// set spring amount
			_appBase.setSpringAmount( .5 );
			// set move particles function in parent
			_viewModeHandler = wobbleAvoid;
			_appBase.setMovementFunction( animateParticles );
		
			// init comps and set listeners
			_comps 	= new ParticleComps( ".comps", COMPS_WIDTH, COMPS_HEIGHT, BACKGROUND_COLOUR );
			_comps.setMinDistanceHandler( minDistance_handler )
			_comps.friction_handler( friction_handler )
			_comps.mouseMass_handler( mouseMass_handler )
			_comps.radius_handler( radius_handler )
			_comps.showSmile_handler( showSmile_handler )
			_comps.setShowStatsHandler( showStats_handler )
			
			_comps.activetView();			// show comps
			createParticles(); 				// create particles
			addListeners();					// add listeners
			_appBase.startAnimation(); 		// start animation
			
			// resize handler
			_comps.resize_handler = this.resize_handler;
		}
		// resize handler
		particleWallClazz.resize_handler = function( canvas ) { refreshParticles(); }
		// dispose
		particleWallClazz.dispose = function()
		{
			_appBase.stopAnimation();
			_appBase.dispose();
			_appBase = null;
			particleWallClazz = null;
			_comps.dispose();
			_comps = null;
		}
		
		
	// [ HANDLERS 

		// change friction
		function friction_handler( event ) { _friction = event.getValue(); };
		// change min distance
		function minDistance_handler( event ) { _appBase.setMinDistance( event.getValue() ); };
		// mousr mass handler
		function mouseMass_handler( event ) { _mouseMass = event.getValue(); }
		// change radius
		function radius_handler( event ) 
		{ 
			if( _currentRadius === Math.round( event.getValue() ) ) return;
			_currentRadius = Math.round( event.getValue() );
			
			if( _currentRadius >= event.getMaximum() ) return;
			if( _currentRadius <= event.getMinimum() ) return;
			
			_particleRadius = _currentRadius;
			refreshParticles();
		};
		// show smile, change animated function
		function showSmile_handler( event ) 
		{  
			_appBase.stopAnimation();
			if( event.getSelected() )
			{
				_viewModeHandler = showSmile
			}
			else
			{
				_viewModeHandler = wobbleAvoid;
			}
			_appBase.startAnimation();	
		};
		// pass in the stats from comps
		function showStats_handler( stats ) { _appBase.setStats( stats ) }
	
	// ] 
		
		/*
		 * resize
		 */
		function resize_handler( canvas )  { refreshParticles(); }
		
		/*
		 * add mouse move listeners
		 */
		function addListeners() { $( "body" ).mousemove( mouseMove_handler ); }
		
		/*
		 * mouse move handler, capture and set mouse coordinates
		 */
		function mouseMove_handler( event )
		{
			_mouseX = event.pageX;
			_mouseY = event.pageY;
		}
		
		/*
		 * create all particles
		 */
		function createParticles()
		{
			var xPos = _doubleRadius;
			var yPos = _doubleRadius;
			var particle;
			var layout = [];
			
			// calculate amount of particles to show
			_columns = _canvas.width / Math.round( _doubleRadius + _particleMagin );
			_rows	 = _canvas.height / Math.round( _doubleRadius + _particleMagin );
			
			for( var c = 0; c < _columns; c++ ) // loop through columns
			{
				for( var r = 0; r < _rows; r++ ) //  loop through rows
				{
					particle 			= new Particle( _particleRadius, Math.random() * 0xFFFFFF, false );
					particle.x 			= ( xPos + ( _doubleRadius + _particleMagin ) * c );
					particle.y 			= ( yPos + ( _doubleRadius + _particleMagin ) * r );
					particle.vx			= Math.random() * 6 - 3;
					particle.vy 		= Math.random() * 6 - 3;
					particle.mass 		= _particleRadius;	
					particle.setStartingPosition( particle.x, particle.y );
					_appBase.particlesArray().push( particle ); // populate base app array	
				}
			}
		}
		
		/*
		 * refresh and remove existing particles to fill visible area
		 */
		function refreshParticles() 
		{
			_appBase.stopAnimation();
			_halfStage = _canvas.height / 2;
			
			var particlesArray = _appBase.particlesArray();
			var i = particlesArray.length;
			var particle;
			
			while( --i < -1 )
			{
				particle = particlesArray[ i ];
				particle.dispose();
				particle = null;
			}
			_appBase.setParticlesArray([]); // reset array in super
			
			createParticles();
			_appBase.startAnimation();
		}
		
	// [ ANIMATION METHODS 
		
		/*
		 * animate particles
		 */
		function animateParticles()
		{
			var particlesArr = _appBase.particlesArray();
			var particle;
			
			var i = particlesArr.length;
			while( --i > -1 )
			{
				particle = particlesArr[ i ];
				_viewModeHandler( particle );
			}
		}
		
		/*
		 * animate the particles
		 */
		function wobbleAvoid( particle, i )
		{
			// get starting position
			var startingPoint = particle.getStartingPoint();
			
			var dx = startingPoint.x - _mouseX;
			var dy = startingPoint.y - _mouseY;
			
			var distance = Math.sqrt( dx * dx + dy * dy );
			var targetPos = { x : 0, y : 0 };
			
			if( distance < _appBase.minDistance() )
			{
				var angle = Math.atan2( dy, dx );
				targetPos.x = startingPoint.x + Math.cos( angle ) * _mouseMass;
				targetPos.y = startingPoint.y + Math.sin( angle ) * _mouseMass;
				
			}
			else // set to original position
			{
				targetPos.x = startingPoint.x;
				targetPos.y = startingPoint.y;
			}
			
			if( particle.x == targetPos.x && particle.y == targetPos.y ) return;
			
			particle.vx = ( targetPos.x - particle.x ) * _appBase.springAmount();
			particle.vy = ( targetPos.y - particle.y ) * _appBase.springAmount();
			particle.vx *= _friction;
			particle.vy *= _friction;
			
			// move to position
			particle.x += particle.vx;
			particle.y += particle.vy;
			
		}
	
		/*
		 * show smile hadler
		 * just for fun and randomly found
		 */
		function showSmile( particle )
		{
			var startingPoint = particle.getStartingPoint();
			
			var dx = _mouseX - startingPoint.x;
			var dy = _mouseY - startingPoint.y;
			
			var distance = Math.sqrt( dx * dx + dy * dy );
			var targetPos = { x : 0, y : 0 };
			
			var smileDistance = ( _appBase.minDistance() * .8 ); // create a min dist in between
			
			if( distance < _appBase.minDistance() && distance > smileDistance )
			{
				// create circular border
				var theta = ( dy / distance );
				var angle = Math.asin( theta ) * 180 / Math.PI;
					
				if( _mouseX < startingPoint.x ) angle = 180 - angle;
				angle = 270 - angle;
				
				var radian = angle / 180 * Math.PI;
				
				targetPos.x = _mouseX + Math.sin( radian ) * ( _appBase.minDistance() * .75 );
				targetPos.y = _mouseY + Math.cos( radian ) * ( _appBase.minDistance() * .75 );
				
			}
			else if(  distance < smileDistance )
			{
				var smileTheta = ( dx / smileDistance );
				var smileAngle = Math.asin( smileTheta ) * 180 / Math.PI;
				var yMargin = 0;
				
				if( _mouseY < _halfStage )
				{
					smileAngle = 180 - smileAngle;
					yMargin = ( _appBase.minDistance() * .55 );
				}
				
				var smileRad = smileAngle / 180 * Math.PI; // get the semi circle
				
				targetPos.x = _mouseX + Math.sin( smileRad ) * ( _appBase.minDistance() * .35 );
				targetPos.y = ( _mouseY  + yMargin ) + Math.cos( smileRad ) * ( _appBase.minDistance() * .35 );
				
				if( _eyeCount == 0 )
				{
					targetPos.x = _mouseX - 40;
					targetPos.y = _mouseY - 30;
					
					_eyeCount++;
				}
				else if( _eyeCount == 1 )
				{
					targetPos.x = _mouseX + 40;
					targetPos.y = _mouseY - 30;
					
					_eyeCount++;
				}
			}	
			else // set to original position
			{
				if( _eyeCount > 0 ) _eyeCount--;
				targetPos.x = startingPoint.x;
				targetPos.y = startingPoint.y;
			}
			
			if( particle.x == targetPos.x && particle.y == targetPos.y ) return;
			
			particle.vx = ( targetPos.x - particle.x ) * _appBase.springAmount();
			particle.vy = ( targetPos.y - particle.y ) * _appBase.springAmount();
			particle.vx *= _friction;
			particle.vy *= _friction;
			
			// move to position
			particle.x += particle.vx;
			particle.y += particle.vy;
		}
	
	// ] 
	
		// return CLASS OBJECT
		return particleWallClazz;
	}
	// return MODULE CLASS
	return ParticleWall;
})