define( ["scripts/js/CompsBase.js"], function( CompsBase ) 
{
	var MAX_PARTICLES			= 100;
	var MAX_GLOW		        = 30;
	var MAX_MIN_DISTANCE		= 400;
	var MAX_FRICTION			= 1;
	
	var STARTING_MIN_DISTANCE	= 100;
	var STARTING_NUM_PARTICLES	= 30;
	var STARTING_TINT			= 10;
	
	// handlers
	var _minimumDistance_handler;
	var _numParticles_handler;
	var _glowAmount_handler;
	var _colourChoice_handler;
	var _removeColour_handler;
	var _gravitate_handler;
	var _showStats_handler;
	
	var _div;
	var _elementWidth;
	var _elementHeight;
	var _compsColour;
	var _instance;
	
	/*
	 * NodeGardenComps Class
	 */
	var NodeGardenComps = CompsBase.extend(
	{
		/*
		 * Constructor, initialise
		 */
		init : function( compsElementName, width, height, colour )
		{
			this._super( false ); // call init on super
			
			_div 			= $( compsElementName ).get(0);;
			_elementWidth 	= width;
			_elementHeight 	= height;
			_compsColour	= colour;
			
			// apply local handler to global handler function variable
			_showStats_handler = this.showStats_handler;
			_instance = this;
		},
		// activate view 
		activetView : function()
		{
			setUpComps(  );
			this.setChevron( _elementWidth , _elementHeight, -250, "43px auto" );
		},
		click_handler : function( event ) // override click ahndler and tween panel
		{
			_instance.tweenPanel( _div, _instance );
		},
		// define handlers
		setMinDistanceHandler 	: function( handler ) { _minimumDistance_handler = handler; }, 	// min distance
		setNumParticlesHandler 	: function( handler ) { _numParticles_handler = handler; },		// num particles
		setGlowHandler		 	: function( handler ) { _glowAmount_handler = handler; },		// glow
		setColourChoiceHandler 	: function( handler ) { _colourChoice_handler = handler; },		// colour choice
		setRemoveColourHandler 	: function( handler ) { _removeColour_handler = handler; },		// remove colour mix
		setGravitateHandler 	: function( handler ) { _gravitate_handler = handler; },		// gravitate instead of spring
		// dispose
		dispose : function()
		{
			this._super();
			_div.style.backgroundColor = "#000000";
			_div.style.width = "0px";
			_div.style.height = "0px";
			this.removeChildren( _div, "CANVAS" );
		}
		
	})	
	
	// return CLASS
	return NodeGardenComps;
	
// -------------------------------------- [ PRIVATE METHODS ] ----------------------------------- //

	// setup the components view
	function setUpComps( )
	{
		
		_div.style.backgroundColor = _compsColour;
		_div.style.width = _elementWidth;
		_div.style.height = _elementHeight;
		_div.style.position = "absolute"
		
		// minimum distance slider
		minimalDistanceSlider = new mc.HSlider( _div, 10, 10, _minimumDistance_handler ).bindLabel(new mc.Label( _div, 100, 25 ).setAlign("left"), 0 );
		minimalDistanceSlider.setMaximum( MAX_MIN_DISTANCE );
		minimalDistanceSlider.setValue( STARTING_MIN_DISTANCE );
		minimalDistanceSlider.updateLabel();
		var mLabel = new mc.Label( _div, 10, 25, "Min Distance" ).setAlign("left");
		
		// number of particles in view
		numParticles = new mc.HSlider( _div, 10, 40, _numParticles_handler ).bindLabel(new mc.Label( _div, 100, 55 ).setAlign("left"), 0 );
		numParticles.setMaximum( MAX_PARTICLES );
		numParticles.setValue( STARTING_NUM_PARTICLES );
		numParticles.updateLabel();
		var pLabel = new mc.Label( _div, 10, 55, "Num Particles" ).setAlign("left");
		
		// number of particles in view
		glowSlider = new mc.HSlider( _div, 10, 70, _glowAmount_handler ).bindLabel(new mc.Label( _div, 100, 85 ).setAlign("left"), 0 );
		glowSlider.setMaximum( MAX_GLOW );
		glowSlider.setValue( STARTING_TINT );
		glowSlider.updateLabel();
		var gLabel = new mc.Label( _div, 10, 85, "Glow" ).setAlign("left");
		
		// set colouring method
		strongestCheckbox = new mc.CheckBox( _div, 130, 10, "Stongest/Combine", true,  _colourChoice_handler );
		// remove colouring methods
		removeColourMixCheckbox = new mc.CheckBox( _div, 130, 30, "Dont Mix" , false, _removeColour_handler );
		// set animation function to use
		gravitateCheckbox = new mc.CheckBox( _div, 130, 50, "Gravitate", false,  _gravitate_handler );
		// show stats
		showStatsCheckbox = new mc.CheckBox( _div, 130, 70, "Stats", false, _showStats_handler );
	}
	
})














