define( ["scripts/js/CompsBase.js"], function( CompsBase ) 
{
	
	var MAX_RADIUS				= 14;
	var MAX_FRICTION			= 4;
	var MAX_DISTANCE			= 600;
	var MAX_MOUSE_MASS			= 800;
	
	var STARTING_RADIUS			= 10;
	var STARTING_MIN_DISTANCE	= 100;
	var STARTING_FRICTION		= 1;
	var STARTING_MOUSE_MASS		= 100;
	
	
	// handlers
	var _minimumDistance_handler;
	var _friction_handler;
	var _mouseMass_handler;
	var _radius_handler;
	var _showSmile_handler;
	var _showStats_handler;
	// components
	var _frictionSlider;
	var _fLabel;
	var _minDistanceSlider;
	var _mLabel;
	var _mouseMassSlider;
	var _massLabel;
	var _particleRadiusSlider;
	var _pLabel;
	
	
	var _div;
	var _elementWidth;
	var _elementHeight;
	var _compsColour;
	var _instance;
	
	
	/*
	 * Class
	 */
	var ParticleWallComps = CompsBase.extend
	({
		/*
		 * Constructor, initialise
		 */
		init : function( compsElementName, width, height, colour )
		{
			this._super( ); // call init on super
			
			_div 					= $( compsElementName ).get(0);;
			_elementWidth 			= width;
			_elementHeight 			= height;
			_compsColour			= colour;
			
			this.elementName 		= compsElementName;
			
			// apply local handler to global handler function variable
			_showStats_handler = this.showStats_handler;
			_instance = this; // reference to this instance
			
		},
		// activate view 
		activetView : function()
		{
			setUpComps();
			this.setChevron( _elementWidth , _elementHeight, "-625px", "10px auto" );
		},
		click_handler : function( event ) // override click ahndler and tween panel
		{
			_instance.tweenPanel( _instance );
		},
		// define handlers
		setMinDistanceHandler 	: function( handler ) { _minimumDistance_handler = handler; }, 	// min distance
		friction_handler 		: function( handler ) { _friction_handler = handler; }, 		// friction 
		mouseMass_handler 		: function( handler ) { _mouseMass_handler = handler; }, 		// Mouse Mass
		radius_handler		 	: function( handler ) { _radius_handler = handler; }, 			// radius
		showSmile_handler	 	: function( handler ) { _showSmile_handler = handler; }, 		// show Smile
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
	return ParticleWallComps;
	
// -------------------------------------- [ PRIVATE METHODS ] ----------------------------------- //
	
	
	// setup the components view
	function setUpComps()
	{
		
		_div.style.backgroundColor = _compsColour;
		_div.style.width = _elementWidth;
		_div.style.height = _elementHeight;
		_div.style.position = "absolute"
		_div.style.left = "0px";
		
		// [ SLIDERS
	
		// amount of friction
		_frictionSlider = new mc.HSlider( _div, 40, 10, _friction_handler ).bindLabel(new mc.Label(_div, 140, 25 ).setAlign("left"), 0 );
		_frictionSlider.setMaximum( MAX_FRICTION );
		_frictionSlider.setValue( STARTING_FRICTION );
		_frictionSlider.updateLabel();
		_fLabel = new mc.Label(_div, 45, 25, "Friction" ).setAlign("left");
		
		// minimum distance from mouse
		_minDistanceSlider = new mc.HSlider(_div, 160, 10, _minimumDistance_handler ).bindLabel(new mc.Label(_div, 255, 25 ).setAlign("left"), 0 );
		_minDistanceSlider.setMaximum( MAX_DISTANCE );
		_minDistanceSlider.setValue( STARTING_MIN_DISTANCE );
		_minDistanceSlider.updateLabel();
		_mLabel = new mc.Label(_div, 160, 25, "Min Distance" ).setAlign("left");
		
		// number of particles in view
		_mouseMassSlider = new mc.HSlider( _div, 280, 10, _mouseMass_handler ).bindLabel(new mc.Label(_div, 373, 25 ).setAlign("left"), 0 );
		_mouseMassSlider.setMaximum( MAX_MOUSE_MASS );
		_mouseMassSlider.setValue( STARTING_MOUSE_MASS );
		_mouseMassSlider.updateLabel();
		_massLabel = new mc.Label(_div, 280, 25, "Mouse Mass" ).setAlign("left");
		
		// radiu
		_particleRadiusSlider = new mc.HSlider(_div, 400, 10, _radius_handler ).bindLabel(new mc.Label(_div, 497, 25 ).setAlign("left"), 0 );
		_particleRadiusSlider.setMaximum( MAX_RADIUS );
		_particleRadiusSlider.setValue( STARTING_RADIUS );
		_particleRadiusSlider.setMinimum( 2 );
		_particleRadiusSlider.updateLabel();
		_pLabel = new mc.Label(_div, 400, 25, "Radius" ).setAlign("left");
	
	// ]
		
		// remove colouring methods
		_smileCheckbox = new mc.CheckBox( _div, 520, 10, "Smile" , false, _showSmile_handler );
		// show stats
		_showStatsCheckbox = new mc.CheckBox(_div, 560, 10, "Stats", false, _showStats_handler );
	}
	
	
	
});
