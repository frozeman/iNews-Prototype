/**
 * jQuery Masonry v2.1.07
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */

/*jshint browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function( window, $, undefined ){

  'use strict';

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      dispatchMethod = $.event.handle ? 'handle' : 'dispatch',
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        $event[ dispatchMethod ].apply( context, args );

      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Masonry ===============================


  // our "Widget" object constructor
  $.Mason = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };

  $.Mason.settings = {
    isResizable: true,
    isAnimated: false,
    animationOptions: {
      queue: false,
      duration: 500
    },
    gutterWidth: 0,
    isRTL: false,
    isFitWidth: false,
    containerStyle: {
      position: 'relative'
    }
  };

  $.Mason.prototype = {

    _filterFindBricks: function( $elems ) {
      var selector = this.options.itemSelector;
      // if there is a selector
      // filter/find appropriate item elements
      return !selector ? $elems : $elems.filter( selector ).add( $elems.find( selector ) );
    },

    _getBricks: function( $elems ) {
      var $bricks = this._filterFindBricks( $elems )
        .css({ position: 'absolute' })
        .addClass('masonry-brick');
      return $bricks;
    },
    
    // sets up widget
    _create : function( options ) {
      
      this.options = $.extend( true, {}, $.Mason.settings, options );
      this.styleQueue = [];

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {
        // get height
        height: elemStyle.height || ''
      };
      // get other styles that will be overwritten
      var containerStyle = this.options.containerStyle;
      for ( var prop in containerStyle ) {
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }

      this.element.css( containerStyle );

      this.horizontalDirection = this.options.isRTL ? 'right' : 'left';

      var x = this.element.css( 'padding-' + this.horizontalDirection );
      var y = this.element.css( 'padding-top' );
      this.offset = {
        x: x ? parseInt( x, 10 ) : 0,
        y: y ? parseInt( y, 10 ) : 0
      };
      
      this.isFluid = this.options.columnWidth && typeof this.options.columnWidth === 'function';

      // add masonry class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass('masonry');
      }, 0 );
      
      // bind resize method
      if ( this.options.isResizable ) {
        $(window).bind( 'smartresize.masonry', function() { 
          instance.resize();
        });
      }


      // need to get bricks
      this.reloadItems();

    },
  
    // _init fires when instance is first created
    // and when instance is triggered again -> $el.masonry();
    _init : function( callback ) {
      this._getColumns();
      this._reLayout( callback );
    },

    option: function( key, value ){
      // set options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( key ) ){
        this.options = $.extend(true, this.options, key);
      } 
    },
    
    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $bricks, callback ) {

      // place each brick
      for (var i=0, len = $bricks.length; i < len; i++) {
        this._placeBrick( $bricks[i] );
      }
      
      // set the size of the container
      var containerSize = {};
      containerSize.height = Math.max.apply( Math, this.colYs ) + 20; // add 20
      if ( this.options.isFitWidth ) {
        var unusedCols = 0;
        i = this.cols;
        // count unused columns
        while ( --i ) {
          if ( this.colYs[i] !== 0 ) {
            break;
          }
          unusedCols++;
        }
        // fit container to columns that have been used;
        containerSize.width = (this.cols - unusedCols) * this.columnWidth - this.options.gutterWidth;
      }
      this.styleQueue.push({ $el: this.element, style: containerSize });

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.options.isAnimated ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions;

      // process styleQueue
      var obj;
      for (i=0, len = this.styleQueue.length; i < len; i++) {
        obj = this.styleQueue[i];
        obj.$el[ styleFn ]( obj.style, animOpts );
      }

      // clear out queue for next time
      this.styleQueue = [];

      // provide $elems as context for the callback
      if ( callback ) {
        callback.call( $bricks );
      }
      
      this.isLaidOut = true;
    },
    
    // calculates number of columns
    // i.e. this.columnWidth = 200
    _getColumns : function() {
      var container = this.options.isFitWidth ? this.element.parent() : this.element,
          containerWidth = container.width();

                         // use fluid columnWidth function if there
      this.columnWidth = this.isFluid ? this.options.columnWidth( containerWidth ) :
                    // if not, how about the explicitly set option?
                    this.options.columnWidth ||
                    // or use the size of the first item
                    this.$bricks.outerWidth(true) ||
                    // if there's no items, use size of container
                    containerWidth;

      this.columnWidth += this.options.gutterWidth;

      this.cols = Math.floor( ( containerWidth + this.options.gutterWidth ) / this.columnWidth );
      this.cols = Math.max( this.cols, 1 );

    },

    // layout logic
    _placeBrick: function( brick ) {
      var $brick = $(brick),
          colSpan, groupCount, groupY, groupColY, j;

      //how many columns does this brick span
      colSpan = Math.ceil( $brick.outerWidth(true) / this.columnWidth );
      colSpan = Math.min( colSpan, this.cols );

      if ( colSpan === 1 ) {
        // if brick spans only one column, just like singleMode
        groupY = this.colYs;
      } else {
        // brick spans more than one column
        // how many different places could this brick fit horizontally
        groupCount = this.cols + 1 - colSpan;
        groupY = [];

        // for each group potential horizontal position
        for ( j=0; j < groupCount; j++ ) {
          // make an array of colY values for that one group
          groupColY = this.colYs.slice( j, j+colSpan );
          // and get the max value of the array
          groupY[j] = Math.max.apply( Math, groupColY );
        }

      }

      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, groupY ),
          shortCol = 0;
      
      // Find index of short column, the first from the left
      for (var i=0, len = groupY.length; i < len; i++) {
        if ( groupY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var position = {
        top: minimumY + this.offset.y
      };
      // position.left or position.right
      position[ this.horizontalDirection ] = this.columnWidth * shortCol + this.offset.x;
      this.styleQueue.push({ $el: $brick, style: position });

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.colYs[ shortCol + i ] = setHeight;
      }

    },
    
    
    resize: function() {
      var prevColCount = this.cols;
      // get updated colCount
      this._getColumns();
      if ( this.isFluid || this.cols !== prevColCount ) {
        // if column count has changed, trigger new layout
        this._reLayout();
      }
    },
    
    
    _reLayout : function( callback ) {
      // reset columns
      var i = this.cols;
      this.colYs = [];
      while (i--) {
        this.colYs.push( 0 );
      }
      // apply layout logic to all bricks
      this.layout( this.$bricks, callback );
    },
    
    // ====================== Convenience methods ======================
    
    // goes through all children again and gets bricks in proper order
    reloadItems : function() {
      this.$bricks = this._getBricks( this.element.children() );
    },
    
    
    reload : function( callback ) {
      this.reloadItems();
      this._init( callback );
    },
    

    // convienence method for working with Infinite Scroll
    appended : function( $content, isAnimatedFromBottom, callback ) {
      if ( isAnimatedFromBottom ) {
        // set new stuff to the bottom
        this._filterFindBricks( $content ).css({ top: this.element.height() });
        var instance = this;
        setTimeout( function(){
          instance._appended( $content, callback );
        }, 1 );
      } else {
        this._appended( $content, callback );
      }
    },
    
    _appended : function( $content, callback ) {
      var $newBricks = this._getBricks( $content );
      // add new bricks to brick pool
      this.$bricks = this.$bricks.add( $newBricks );
      this.layout( $newBricks, callback );
    },
    
    // removes elements from Masonry widget
    remove : function( $content ) {
      this.$bricks = this.$bricks.not( $content );
      $content.remove();
    },
    
    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      this.$bricks
        .removeClass('masonry-brick')
        .each(function(){
          this.style.position = '';
          this.style.top = '';
          this.style.left = '';
        });
      
      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var prop in this.originalStyle ) {
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }

      this.element
        .unbind('.masonry')
        .removeClass('masonry')
        .removeData('masonry');
      
      $(window).unbind('.masonry');

    }
    
  };
  
  
  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.1.0
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded( event ) {
      var img = event.target;
      if ( img.src !== blank && $.inArray( img, loaded ) === -1 ){
        loaded.push( img );
        if ( --len <= 0 ){
          setTimeout( triggerCallback );
          $images.unbind( '.imagesLoaded', imgLoaded );
        }
      }
    }

    // if no images, trigger immediately
    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load.imagesLoaded error.imagesLoaded',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      var src = this.src;
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      // data uri bypasses webkit log warning (thx doug jones)
      this.src = blank;
      this.src = src;
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( window.console ) {
      window.console.error( message );
    }
  };
  
  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Mason constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel 
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.masonry = function( options ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'masonry' );
        if ( !instance ) {
          logError( "cannot call methods on masonry prior to initialization; " +
            "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for masonry instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'masonry' );
        if ( instance ) {
          // apply options & init
          instance.option( options || {} );
          instance._init();
        } else {
          // initialize new instance
          $.data( this, 'masonry', new $.Mason( options, this ) );
        }
      });
    }
    return this;
  };

})( window, jQuery );


/* **********************************************
     Begin jquery.easing.1.3.js
********************************************** */

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

/* **********************************************
     Begin main.js
********************************************** */

//@codekit-prepend "vendor/!!mootools-core-1.4.5.js";
//@codekit-prepend "vendor/!!mootools-more-1.4.0.1.js";
//@codekit-prepend "vendor/!!async.js";

//@codekit-prepend "vendor/jquery.requestAnimationFrame.min.js", "vendor/plugins/jquery.masonry.js", "vendor/plugins/jquery.easing.1.3.js";


//, "vendor/plugins/jquery.hammer.min.js";


// new PlaceholderSupport();




$(function(){

    // VARS
    var ISMOBILE = (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) ? true : false,
        CURRENTDETAILTILE = false,
        VIEWTYPE = 'read',
        HOVERTIMOUT = (ISMOBILE) ? 0 : 300,
        RESIZETIMEOUTID,
        RESIZETIMOUT = (ISMOBILE) ? 1 : 99,
        GRIDANIMATE = (ISMOBILE) ? false : true,
        $VIEWPORT = $('html, body');
        // scrollWindow = new Fx.Scroll(window);


    // HELPER FUNCTIONS
    // Calculate the smallest Tile
    var TileSize = function(containerWidth) {
        var dividerWidth = ($('.mainGrid').width() <= 480) ? 30 : 60;
        containerWidth = $('.mainGrid').width() - dividerWidth; // DEACTIVATE ??
        var division = 1;
        if(containerWidth > 768) division = 2;
        if(containerWidth > 1600) division = 4;
        // division = (containerWidth > 1200) ? 3 : division;
        var containerSize = Math.floor(containerWidth / 2);
        while(containerSize%16 !== 0) {
            containerSize--;
        }

        return containerSize / (division * 4);
    };

    var matrixToArray = function(matrix) {
        if(matrix !== 'none')
            return matrix.substr(7, matrix.length - 8).split(', ');
        else
            return [];
    };

    // Stop the window scrolling if the user scrolls.
    $VIEWPORT.bind('scroll mousedown DOMMouseScroll mousewheel keyup', function(e){
        if ( e.which > 0 || e.which < 0 || e.type === 'mousedown' || e.type === 'mousewheel')
            $VIEWPORT.stop();
    });

    // debulked onresize handler
    // function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c};


    var flipTiles = function(){
        var countLeft = {count:0};
        var countRight = {count:0};


        // if(VIEWTYPE === 'read') {
        //     $('.tile').removeClass('flip');
        // } else {
        //     $('.tile').addClass('flip');
        // }

        function turn(container,number){
            if(VIEWTYPE === 'read') {
                $($(container + ' .tile')[number.count]).removeClass('flip');
            } else {
                $($(container + ' .tile')[number.count]).addClass('flip');
            }
            number.count++;
            if(number.count <= $(container + ' .tile').length) {
                window.setTimeout(function(){
                    turn(container,number);
                }, 0);
            }
        }

        VIEWTYPE = (VIEWTYPE === 'topic') ? 'read' : 'topic';

        turn('.mainGrid > .containerLeft',countLeft);
        turn('.mainGrid > .containerRight',countRight);
    };




    // DOM READY
    $(document).ready(function(){

        // $.fn.masonry.prototype.layout = function($bricks, callback) {
        //     // Call the method from the parent = Super_class.prototype.method
        //     this.constructor.prototype.layout($bricks, callback);
        //     containerSize.height = containerSize.height + 20;
        //     console.log(containerSize);
        // };

        var oldcss = $.fn.masonry.layout;
        // ...before overwriting the jQuery extension point
        // $.fn.masonry.layout = function()
        // {
        //     // original behavior - use function.apply to preserve context
        //     var ret = oldcss.apply(this, arguments);

        //     console.log(containerSize);

        //     // preserve return value (probably the jQuery object...)
        //     return ret;
        // };


        // SET MASONRY
        $('.mainGrid > .containerLeft').masonry({
          isRTL: true,
          itemSelector: '.tile',
          columnWidth : TileSize,
          position: 'relative',
          isAnimated: GRIDANIMATE
        });
        $('.mainGrid > .containerRight').masonry({
          itemSelector: '.tile',
          columnWidth : TileSize,
          position: 'relative',
          isAnimated: GRIDANIMATE
        });


        // $('.mainGrid > .containerLeft, .mainGrid > .containerRight').masonry('reloadItems');

        $(window).trigger('resize');

        // BOOKMARK BUTTON
        var $slideElements = $('.mainGrid, .mainGrid > .divider, header.main, footer.main');
        $('.bookmarkButton').click(function(e){
            e.preventDefault();

            $slideElements.toggleClass('slideRight');
            $(this).toggleClass('active');
        });

        // SHOW/HIDE LEFT SIDEBAR BY SWIPE
        // var $slideElementsHammer = $('.mainGrid').hammer({swipe_velocity: 0.2});
        // $slideElementsHammer.on("swipeleft", function(e) {
        //     $slideElements.removeClass('slideRight');
        //     $('.bookmarkButton').removeClass('active');
        // });
        // $slideElementsHammer.on("swiperight", function(e) {
        //     $slideElements.addClass('slideRight');
        //     $('.bookmarkButton').addClass('active');
        // });


        // FLIP ALL TILES BUTTON
        $('.viewButton').click(function(e) {
            e.preventDefault();
            flipTiles();
            $(this).toggleClass('active');
        });

        // SEARCH INPUT
        $('.pathMenu input').on('keyup',function(e){
            var $input = $(this);

            // clear on ESC
            if(e.keyCode == 27)
                $input.val('');

            if($input.val() !== '')
                $input.next('button.cancel').removeClass('hidden');
                // $input.next('button.cancel').css('display','inline-block');
            else
                $input.next('button.cancel').addClass('hidden');
                // $input.next('button.cancel').css('display','none');
        });
        $('.pathMenu button.cancel').mouseup(function(){
            $(this).prev('input').val('').trigger('keyup').trigger('focus');
        });

        // CENTER IMAGES
        $('.image img, .imageZoom img').each(function() {
            var img = $(this);
            if(img.parents('.image, .imageZoom')) {
                img.parents('.image, .imageZoom').css('background-image','url("' + img.attr('src') + '")');
                img.css('display','none');
            }
        });


        // add zoom to article images
        // $('article.main .image').each(function(){
        //     var img = $(this);
        //     var imgZom = $(this).next('.imageZoom');
        //     img.mousemove(function(e){
        //        var parentOffset = img.offset(); //parent()
        //        //or img.offset(); if you really just want the current element's offset
        //        var relY = -((e.pageY - parentOffset.top) - (e.target.offsetHeight/2));
        //        console.log(e.target.offsetHeight);

        //        // if(relX > 0) relX = 0;
        //        // if(relY > 0) relY = 0;

        //        // if(relX > 0) relX = 0;
        //        // if(relY > 0) relY = 0;

        //        if(relY <= 0)
        //            imgZom.css('background-position-y',relY);

        //        // console.log(relY);
        //     });
        // });


        // ATTACH EVENTS to TILES
        $('.mainGrid > div > .tile').each(function(){

            var $tile = $(this);
            var cornerButtonTimeOut;

            // SHOW DETAIL TILE
            // $tile.click(function(e) {

            //     // remove open detail tile first
            //     if(CURRENTDETAILTILE) {
            //         CURRENTDETAILTILE.fadeOut(400, function(){
            //             if($tile)
            //                 $tile.css('z-index','');
            //             $(this).remove();
            //         });
            //         CURRENTDETAILTILE = false;

            //     // then open the detail tile
            //     } else {
            //         var tile = $(e.target).parents('.tile')[0];
            //         if(tile) {
            //             var $tile = $(tile);
            //             var detailTile = $('<div class="tile large detail">' + $tile.html() + '</div>');
            //             $tile.append(detailTile);
            //             $tile.css('z-index',9999);

            //             // if its a top tile
            //             if($tile.position().top === 0)
            //                 detailTile.css('top',0);
            //             else
            //                 detailTile.css('bottom',0);

            //             // if its in the right side
            //             if($(e.target).parents('.containerRight')[0])
            //                 detailTile.css('right',0);
            //             else
            //                 detailTile.css('left',0);

            //             var tileSize = TileSize($(window).width());

            //             detailTile
            //                 .css({
            //                     'bottom': 0,
            //                     'width': tileSize * 4,
            //                     'height': tileSize * 4
            //                 })
            //                 .mouseleave(function(e) {
            //                     detailTile.fadeOut(400, function(){
            //                         $tile.css('z-index','');
            //                         $(this).remove();
            //                     });
            //                     CURRENTDETAILTILE = false;
            //                 })
            //                 .click(function(e){
            //                     e.stopPropagation();
            //                 });

            //             // SCROLL TO DETAIL TILE
            //             if(detailTile.offset().top < $(window).scrollTop())
            //                 $VIEWPORT.animate({scrollTop: detailTile.offset().top - tileSize / 4}, 500, 'easeOutExpo');
            //                 // scrollWindow.start(0,detailTile.offset().top - 20);

            //             CURRENTDETAILTILE = detailTile;
            //         }
            //     }
            // });

            $tile.find('a').click(function(e){
                e.preventDefault();
                // e.stopPropagation();
            });

            // flip back on mouseleave
            $tile.mouseleave(function(){
                if(VIEWTYPE === 'read')
                    $tile.css('z-index','').removeClass('flip');
                else
                    $tile.css('z-index','').addClass('flip');
            });

            // show front/back side
            $tile.find('a.cornerButton').mouseenter(function(e) {
                e.stopPropagation();

                cornerButtonTimeOut = setTimeout(function() {
                    $tile.css('z-index',9999);
                    $tile.toggleClass('flip');
                },HOVERTIMOUT);
            }).mouseleave(function(){
                clearTimeout(cornerButtonTimeOut);
            });

        });
    });


    // RESIZE
    $(window).resize(function() {

        // show the size in the top bar
        $('.pixelWidth').html('width: ' + $(window).width() + 'px');


        // set the font size automatically
        //Standard height, for which the body font size is correct
        // var preferredWidth = 768;

        // var displayWidth = $(window).width();
        // var percentage = displayWidth / preferredWidth;
        // var newFontSize = Math.floor(12 * percentage) - 1;
        // $('.tile').css('font-size', newFontSize);


        var visibleItem = false;
        // use the currently selected one
        if(CURRENTDETAILTILE)
            visibleItem = CURRENTDETAILTILE;
        // get the last visible tile
        else {
            var scrollPos = $(window).scrollTop();
            $('.mainGrid > div > .tile').each(function(index, item){
                item = $(item);
                if(scrollPos > 60 && scrollPos < item.offset().top) {
                    visibleItem = item;
                    return false;
                }
            });
        }


        // IF ARTICLE IS OPEN
        // $('body').css('overflow','hidden');


        // prevent imediate resize
        clearTimeout(RESIZETIMEOUTID);
        RESIZETIMEOUTID = window.setTimeout(function() {


            // set RESPONSIVE TILE SIZES
            var smallTile = TileSize($('.mainGrid').width() - 60);
            var mediumTile = smallTile * 2;
            var largeTile = smallTile * 4;

            // set grid size
            $('.mainGrid .tile.large').css({'width':largeTile,'height':largeTile});
            $('.mainGrid .tile.medium').css({'width':mediumTile,'height':mediumTile});
            $('.mainGrid .tile.small').css({'width':smallTile,'height':smallTile});

            // set article boxes size
            // $('article.main aside.left').css({'width':largeTile});

            // set subtiles size
            // var subsmallTile = TileSize(largeTile);
            // var submediumTile = subsmallTile * 2;
            // var sublargeTile = subsmallTile * 4;

            // $('.large .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
            // $('.large .subTile.medium').css({'width':submediumTile,'height':submediumTile});
            // $('.large .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

            // var subsmallTile = TileSize(mediumTile);
            // var submediumTile = subsmallTile * 2;
            // var sublargeTile = subsmallTile * 4;

            // $('.medium .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
            // $('.medium .subTile.medium').css({'width':submediumTile,'height':submediumTile});
            // $('.medium .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

            // var subsmallTile = TileSize(smallTile);
            // var submediumTile = subsmallTile * 2;
            // var sublargeTile = subsmallTile * 4;

            // $('.small .subTile.large').css({'width':sublargeTile,'height':sublargeTile});
            // $('.small .subTile.medium').css({'width':submediumTile,'height':submediumTile});
            // $('.small .subTile.small').css({'width':subsmallTile,'height':subsmallTile});

            // set the CONTAINER WIDTH
            // $('.gridContainer').css({
                // 'width': $(window).width()
            // });

            // SCROLL TO the LAST VISIBLE ITEM
            if(visibleItem) {
                window.setTimeout(function() {
                    // $VIEWPORT.animate({scrollTop: visibleItem.offset().top - smallTile}, 900, 'easeOutElastic');
                    // scrollWindow.start(0,visibleItem.offset().top);
                }, 500);
            }

        }, RESIZETIMOUT);

    });
});
