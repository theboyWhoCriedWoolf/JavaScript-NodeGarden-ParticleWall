define( [ 
			"scripts/js/helper/Class.js",
			"scripts/js/plugins/jquery.easing.1.3.js", 
			"scripts/js/helper/Stats.js", 
			"scripts/js/plugins/MinimalComps-0.1.min.js" 
		], function () 
{
	var _stats;
	var _canvas;
	var _statsCallback;
	// Module Class
	var CompsBase = Class.extend(
	{
			/*
			 * Constructor, initialise
			 */
			init : function( compsPanelBtn, compsArrow )
			{
				this._chevron				= ( compsPanelBtn ) ? compsPanelBtn : $("#compsPanelBtn").get(0); // get the button;
				this._chevronArrow			= ( compsArrow ) ? compsArrow : $("#compsArrow").get(0); ;
				
				this._panelClosePos			= 0;
				this._open					= true;
			},
			// add remove listeners
			addListeners : function() { this._chevron.addEventListener( "click", this.click_handler ); },
			removeListeners : function() { this._chevron.removeEventListener( "click", this.click_handler ); },
			click_handler : function( event ) {},  // override to tween correct panel
			tweenPanel : tweenPanel,			   // tween panel
			elementName : "",					   // define element name
			// set the chevron and align
			setChevron : function( positionLeft, panelHeight, panelWidth, arrowPadding )
			{
				this._panelClosePos = panelWidth;
				
				// set initial chevron position
				this._chevronArrow.style.backgroundPosition = "-8px";
				
				this._chevron.style.left = positionLeft;
				this._chevron.style.position = "absolute";
				this._chevron.style.height = panelHeight;
				this._chevronArrow.style.margin = arrowPadding;
				
				this.addListeners();
			},
			// show stats handler
			showStats_handler : function( event ) 
			{ 
				showStats( event.getSelected() ); 
				if( _statsCallback ) _statsCallback( _stats );
			},
			// activate the view
			activetView : function(){},
			// return stats
			setShowStatsHandler : function( handler ) { _statsCallback = handler; },
			//dispose
			dispose : function()
			{
				this._chevron.style.left 			= "0px";
				this._chevron.style.height			= "0px";
				this._chevronArrow.style.margin 	= "0px";
				this.removeListeners();
			},
			removeChildren : removeChildren
			
	})
	// RETURN CLAZZ OBJECT
	return CompsBase;
	
// [ PRIVATE METHODS	
	
	/*
	 * loop through elements and dispose
	 * removes all the min-comps elements
	 */
	function removeChildren( element, type )
	{
		var children 	= element.childNodes; 	// get child nodes from div
		var i 			= children.length;		// get length
		
		var child;
		while( --i > -1 )						// loop through removing children matching type
		{
			child = children[ i ];
			if( child.nodeName === type ) element.removeChild( child );
		}
	}
	
	/*
	 * show or hide the stats
	 */
	function showStats( show ) 
	{
		if( show )
		{
			_stats = new Stats();
			_stats.setMode(2); // 0: fps, 1: ms
			// Align top-left
			_stats.domElement.style.position = 'absolute';
			_stats.domElement.style.right = '0px';
			_stats.domElement.style.top = '0px';
			document.body.appendChild( _stats.domElement );
		}
		else
		{
			document.body.removeChild( _stats.domElement );
			_stats = null;
		}
	}
	
	/*
	 * click handler
	 */
	function tweenPanel( instance )
	{
		if( instance._open ) $( instance.elementName ).animate({ left: instance._panelClosePos }, "1000", "easeOutQuad"  )
		else $( instance.elementName ).animate({ left: "0px" } )
		instance._chevronArrow.style.backgroundPosition = ( instance._open ) ? "0px" : "-8px";
		instance._open = !instance._open;
	}
	
// ]

	
})

