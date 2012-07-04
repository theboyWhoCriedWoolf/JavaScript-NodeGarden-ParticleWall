requirejs.config({ // load in jquery before plugin
    shim: {
        'scripts/js/plugins/jquery.easing.1.3.js': ['scripts/js/plugins/jquery.js'],
    }
});

 //This callback is called after the scripts finish loading.
require
		([ 
		"scripts/js/plugins/domReady.js",
		"scripts/js/NodeGarden.js",
		"scripts/js/ParticleWall.js",
		"scripts/js/ViewSelectorComps.js",
		"scripts/js/plugins/jquery.js"
		
		  ], function( domReady, NodeGarden, ParticleWall, ViewSelectorComps ) {
	    // makes sure the init function waits for the dom to be ready
	    // domReady.js provides multi browser support as not all browsers support DOMContentLoaded
	    domReady(function () { init( NodeGarden, ParticleWall, ViewSelectorComps ); })
});




	// static consts
	var BACKGROUND_COLOUR 	= "#3ba790";
	var PANEL_WIDTH			= "100px";
	var PANEL_HEIGHT		= "50px";
	var PANEL_OPEN_POS   	= "0";
	var PANEL_CLOSE_POS	  	= "-100";
	var NODEGARDEN_REF 		= "nodeGarden";
	var PARTICLEWALL_REF	= "particleWall";
	
	var NodeGardenClass;
	var ParticleWallClass;
	
	var _currentView;
	var _canvas;
	var _context;
	var _viewSelectorComps;
	var _currentViewRef;
	
	// initiate the main view
	function init( NodeGarden, ParticleWall, ViewSelectorComps ) 
	{
		_canvas 			= document.getElementById('canvas'); // gets canvas element
		_context 			= _canvas.getContext('2d');
		
		NodeGardenClass 	= NodeGarden;
		ParticleWallClass	= ParticleWall;
		
		_viewSelectorComps 	= new ViewSelectorComps( ".selectionPanel", PANEL_WIDTH, PANEL_HEIGHT, BACKGROUND_COLOUR );
		_viewSelectorComps.setShowNodeGardenHandler( showNodeGarden_handler );
		_viewSelectorComps.setShowParticleWallHandler( showParticleWall_handler );
		_viewSelectorComps.activateView();
		
		onresize( null );
		
		setView( NODEGARDEN_REF );
	}
	
	
// [ HANDLERS 
	
	/*
	 * load the required js file and display
	 */
	function setView( clazzRef )
	{
		if( _currentViewRef == clazzRef ) return;
		_currentViewRef = clazzRef;
		
		var Clazz = ( clazzRef == NODEGARDEN_REF ) ? NodeGardenClass : ParticleWallClass;
		if( _currentView )
		{
			_currentView.dispose();
			_currentView = null;
		} 
		_currentView = new Clazz();
		_currentView.init( _context, _canvas )
	}
	
	function showNodeGarden_handler( event )
	{
		_viewSelectorComps.particleWallCheckbox().setSelected( ! event.getSelected() )
		setView( ( event.getSelected() ) ? NODEGARDEN_REF : PARTICLEWALL_REF );
	}
	
	function showParticleWall_handler( event )
	{
		_viewSelectorComps.nodeGardenCheckbox().setSelected( ! event.getSelected() )
		setView( ( event.getSelected() ) ? PARTICLEWALL_REF : NODEGARDEN_REF );
	}
	
// ]
	
	// resize code, redraw the canvas when body is resized
	window.onresize = function( event )
	{
		_canvas.width = document.body.offsetWidth;
		_canvas.height = document.body.offsetHeight;
	    if( _currentView ) _currentView.resize_handler( _canvas );
	}
	
