define( ["scripts/js/CompsBase.js"], function( CompsBase ) 
{
	
	// handlers
	var _showNodeGarden_handler;
	var _showParticleWall_handler;
	var _nodeGardenCheckbox;
	var _particleWallCheckbox;
	
	var _div;
	var _elementWidth;
	var _elementHeight;
	var _compsColour;
	var _instance;
	
	/*
	 * Class
	 */
	var ViewSelectionComps = CompsBase.extend
	({
		/*
		 * Constructor, initialise
		 */
		init : function( compsElementName, width, height, colour )
		{
			this._super( $("#compsSelectionPanelBtn").get(0), $("#selectionCompsArrow").get(0) ); // call init on super
			
			_div 			= $( compsElementName ).get(0);;
			_elementWidth 	= width;
			_elementHeight 	= height;
			_compsColour	= colour;
			
			// apply local handler to global handler function variable
			_showStats_handler = this.showStats_handler;
			_instance = this;
			
		},
		// activate view 
		activateView : function()
		{
			setUpComps();
			this.setChevron( _elementWidth , _elementHeight, -100, "14px 0 0 3px" );
		},
		click_handler : function( event ) // override click ahndler and tween panel
		{
			_instance.tweenPanel( _div, _instance );
		},
		// define handlers
		setShowNodeGardenHandler 	: function( handler ) { _showNodeGarden_handler = handler; }, 	// min distance
		setShowParticleWallHandler 	: function( handler ) { _showParticleWall_handler = handler; },		// num particles
		nodeGardenCheckbox : function() { return _nodeGardenCheckbox; },
		particleWallCheckbox : function() { return _particleWallCheckbox; },
	})
	
	// return CLASS
	return ViewSelectionComps;
	
// -------------------------------------- [ PRIVATE METHODS ] ----------------------------------- //
	
	
	// setup the components view
	function setUpComps()
	{
		// show node garden
		_div.style.backgroundColor = _compsColour;
		_div.style.width = _elementWidth;
		_div.style.height = _elementHeight;
		// _div.style.position = "absolute"
		
		_nodeGardenCheckbox = new mc.CheckBox( _div, 10, 10, "Node Garden" , true, _showNodeGarden_handler );
		// show particle wall
		_particleWallCheckbox = new mc.CheckBox( _div, 10, 30, "Particle Wall" , false, _showParticleWall_handler );
	}
})
