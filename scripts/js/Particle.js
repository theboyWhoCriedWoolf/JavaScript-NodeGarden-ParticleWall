function Particle(  initialRadius, initialColour, useFilters )
{
	if ( initialRadius === undefined ) { initialRadius = 20; }
  	if ( initialColour === undefined ) { initialColour = "#ff0000"; }
  	if ( useFilters === undefined ) { useFilters = true; }
  
	var myParticle 			= {}
	var staticColour 		= utils.parseColor( initialColour );
	var tintColour 			= utils.parseColor( initialColour );
	var _useFilters 		= useFilters;
	var scaleX, scaleY 		= 1;
	var _startingX 			= 0;
	var _startingY 			= 0;
	
	var lineWidth 			= 0; 
	var rotation 			= 0;
	var blurIncrement 		= .1;
	var currentBlurr 		= 0;
	var shadowColourTint;
	var _fillOption			= regFill;
	

// [  properteis
	
	// radius
	myParticle.radius 		= initialRadius;
	// mass
	myParticle.mass 		= 0;
	// colour
	myParticle.colour 		= utils.parseColor( initialColour );
	// vx
	myParticle.vx 			= 0;
	// vy
	myParticle.vy 			= 0;
	//x and y
	myParticle.x 			= 0;
	myParticle.y 			= 0;
	
	
	// static colour getter
	myParticle.getStaticColour = function() { return staticColour; }
	// set starting position
	myParticle.setStartingPosition = function( xval, yval )
	{
		_startingX = xval;
		_startingY = yval;
	}
	// return starting position, return point / object
	myParticle.getStartingPoint = function() { return { x: _startingX, y: _startingY } } 
	
 // ]
 
 // [ DRAWING 
 
 	// setup fill styles
 	myParticle.REGULAR		 	= "regulareFill";
 	myParticle.ECLIPSE		 	= "eclipseFill";
 	myParticle.HALO			 	= "haloFill";
 	
 	// choose fill option
 	myParticle.setFillStyle = function( style )
 	{
 		switch( style )
 		{
 			case this.REGULAR :
 				_fillOption = regFill;
 				break;
 			case this.ECLIPSE :
 				_fillOption = eclipseFill;
 				break;
 			case this.HALO :
 				_fillOption = haloFill;
 				break;
 			
 			default :
 				_fillOption = regFill;
 				break;
 		}
 	}
 
 	// draw the particle each frame using the canvas context
 	myParticle.draw = function( context )
 	{
	  context.save();
	  context.translate( this.x, this.y );
	  context.rotate( rotation);
	  context.scale( scaleX, scaleY );
	  
	  context.lineWidth = lineWidth;
	  context.fillStyle = _fillOption( context );
	
	if( _useFilters )  
	 {
	 	context.shadowBlur = currentBlurr;
	 	context.shadowColor = shadowColourTint;
	 }
	 
	 
	  context.beginPath();
	  //x, y, radius, start_angle, end_angle, anti-clockwise
	  context.arc( 0, 0, this.radius, 0, (Math.PI * 2), true);
	  context.closePath();
	  context.fill();
		  if ( lineWidth > 0) {
		    context.stroke();
		  }
		  
	  context.restore();

 	}
 
 // ] 
 
 // RADIAL FILL METHODS
 
 // return halo fill
 function haloFill( context ) 
 {
 	 var radgrad = context.createRadialGradient( 0, 0, 1, 0, 0, myParticle.radius );
     radgrad.addColorStop(.5, myParticle.colour );
     radgrad.addColorStop( 0.6, utils.colorToRGB( "#000", 1 ) );
     radgrad.addColorStop( 0.9, "#000" );
     radgrad.addColorStop( 1, myParticle.colour  );
     return radgrad;
 }
 
 // eclipse fill
 function eclipseFill( context ) 
 {
 	 var radgrad = context.createRadialGradient( 0, 0, 1, 0, 0, myParticle.radius );
     radgrad.addColorStop( 0, "#000" );
     radgrad.addColorStop( .8, "#000" );
     radgrad.addColorStop(.9, myParticle.colour );
     return radgrad;
 }
 
 // regular fill
 function regFill( context ) { return myParticle.colour; }
 
 
 
 // ] 
 
 
 // [ TWEENLITE METHODS
 	
 	// set the tint colour and blur amount
 	// increase blur each frame to simulate tweening
 	myParticle.tint = function( newColour , blurAmount ) 
	{
		if( newColour == null ) return;
		var tintColour = ( newColour == -1 ) ? this.staticColour : newColour;
		
		shadowColourTint = tintColour;
		this.colour = tintColour;
		currentBlurr = blurAmount;
	}
	
	// removes the tint and reduces the blur each frame to try and 
	// simulate a tweening effect
	myParticle.removeTint = function() 
	{
		if( currentBlurr > .1 )
		{
			currentBlurr -= blurIncrement;
		}
		else
		{
			shadowColourTint = staticColour;
			this.colour = staticColour;
		}
	}
	/*
	 * force the removal of tint
	 */
	myParticle.forcTintRemove = function() { this.colour = staticColour; }
	
	/*
	 * add or remove filters
	 */
	myParticle.useFilters = function( value ) { _useFilters = value; }
	
	
	/*
	 * dispose
	 */
	myParticle.dispose = function()
	{
		myParticle.radius = 0;
		myParticle.mass = 0;
		myParticle.colour = 0
		myParticle.vx = 0;
		myParticle.vy = 0;
		myParticle.x = 0;
		myParticle.y = 0;
	}
	
 // ] 
 
 	// return particle
 	return myParticle;
	
};
