/**
 * jQuery Masonry v2.1.08
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2012 David DeSandro
 */
(function(e,t,n){"use strict";var r=t.event,i;r.special.smartresize={setup:function(){t(this).bind("resize",r.special.smartresize.handler)},teardown:function(){t(this).unbind("resize",r.special.smartresize.handler)},handler:function(e,t){var n=this,s=arguments;e.type="smartresize",i&&clearTimeout(i),i=setTimeout(function(){r.dispatch.apply(n,s)},t==="execAsap"?0:100)}},t.fn.smartresize=function(e){return e?this.bind("smartresize",e):this.trigger("smartresize",["execAsap"])},t.Mason=function(e,n){this.element=t(n),this._create(e),this._init()},t.Mason.settings={isResizable:!0,isAnimated:!1,animationOptions:{queue:!1,duration:500},gutterWidth:0,isRTL:!1,isFitWidth:!1,containerStyle:{position:"relative"}},t.Mason.prototype={_filterFindBricks:function(e){var t=this.options.itemSelector;return t?e.filter(t).add(e.find(t)):e},_getBricks:function(e){var t=this._filterFindBricks(e).css({position:"absolute"}).addClass("masonry-brick");return t},_create:function(n){this.options=t.extend(!0,{},t.Mason.settings,n),this.styleQueue=[];var r=this.element[0].style;this.originalStyle={height:r.height||""};var i=this.options.containerStyle;for(var s in i)this.originalStyle[s]=r[s]||"";this.element.css(i),this.horizontalDirection=this.options.isRTL?"right":"left";var o=this.element.css("padding-"+this.horizontalDirection),u=this.element.css("padding-top");this.offset={x:o?parseInt(o,10):0,y:u?parseInt(u,10):0},this.isFluid=this.options.columnWidth&&typeof this.options.columnWidth=="function";var a=this;setTimeout(function(){a.element.addClass("masonry")},0),this.options.isResizable&&t(e).bind("smartresize.masonry",function(){a.resize()}),this.reloadItems()},_init:function(e){this._getColumns(),this._reLayout(e)},option:function(e,n){t.isPlainObject(e)&&(this.options=t.extend(!0,this.options,e))},layout:function(e,t){for(var n=0,r=e.length;n<r;n++)this._placeBrick(e[n]);var i={};i.height=Math.max.apply(Math,this.colYs);if(this.options.isFitWidth){var s=0;n=this.cols;while(--n){if(this.colYs[n]!==0)break;s++}i.width=(this.cols-s)*this.columnWidth-this.options.gutterWidth}this.styleQueue.push({$el:this.element,style:i});var o=this.isLaidOut?this.options.isAnimated?"animate":"css":"css",u=this.options.animationOptions,a;for(n=0,r=this.styleQueue.length;n<r;n++)a=this.styleQueue[n],a.$el[o](a.style,u);this.styleQueue=[],t&&t.call(e),this.isLaidOut=!0},_getColumns:function(){var e=this.options.isFitWidth?this.element.parent():this.element,t=e.width();this.columnWidth=this.isFluid?this.options.columnWidth(t):this.options.columnWidth||this.$bricks.outerWidth(!0)||t,this.columnWidth+=this.options.gutterWidth,this.cols=Math.floor((t+this.options.gutterWidth)/this.columnWidth),this.cols=Math.max(this.cols,1)},_placeBrick:function(e){var n=t(e),r,i,s,o,u;r=Math.ceil(n.outerWidth(!0)/this.columnWidth),r=Math.min(r,this.cols);if(r===1)s=this.colYs;else{i=this.cols+1-r,s=[];for(u=0;u<i;u++)o=this.colYs.slice(u,u+r),s[u]=Math.max.apply(Math,o)}var a=Math.min.apply(Math,s),f=0;for(var l=0,c=s.length;l<c;l++)if(s[l]===a){f=l;break}var h={top:a+this.offset.y};h[this.horizontalDirection]=this.columnWidth*f+this.offset.x,this.styleQueue.push({$el:n,style:h});var p=a+n.outerHeight(!0),d=this.cols+1-c;for(l=0;l<d;l++)this.colYs[f+l]=p},resize:function(){var e=this.cols;this._getColumns(),(this.isFluid||this.cols!==e)&&this._reLayout()},_reLayout:function(e){var t=this.cols;this.colYs=[];while(t--)this.colYs.push(0);this.layout(this.$bricks,e)},reloadItems:function(){this.$bricks=this._getBricks(this.element.children())},reload:function(e){this.reloadItems(),this._init(e)},appended:function(e,t,n){if(t){this._filterFindBricks(e).css({top:this.element.height()});var r=this;setTimeout(function(){r._appended(e,n)},1)}else this._appended(e,n)},_appended:function(e,t){var n=this._getBricks(e);this.$bricks=this.$bricks.add(n),this.layout(n,t)},remove:function(e){this.$bricks=this.$bricks.not(e),e.remove()},destroy:function(){this.$bricks.removeClass("masonry-brick").each(function(){this.style.position="",this.style.top="",this.style.left=""});var n=this.element[0].style;for(var r in this.originalStyle)n[r]=this.originalStyle[r];this.element.unbind(".masonry").removeClass("masonry").removeData("masonry"),t(e).unbind(".masonry")}},t.fn.imagesLoaded=function(e){function u(){e.call(n,r)}function a(e){var n=e.target;n.src!==s&&t.inArray(n,o)===-1&&(o.push(n),--i<=0&&(setTimeout(u),r.unbind(".imagesLoaded",a)))}var n=this,r=n.find("img").add(n.filter("img")),i=r.length,s="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",o=[];return i||u(),r.bind("load.imagesLoaded error.imagesLoaded",a).each(function(){var e=this.src;this.src=s,this.src=e}),n};var s=function(t){e.console&&e.console.error(t)};t.fn.masonry=function(e){if(typeof e=="string"){var n=Array.prototype.slice.call(arguments,1);this.each(function(){var r=t.data(this,"masonry");if(!r){s("cannot call methods on masonry prior to initialization; attempted to call method '"+e+"'");return}if(!t.isFunction(r[e])||e.charAt(0)==="_"){s("no such method '"+e+"' for masonry instance");return}r[e].apply(r,n)})}else this.each(function(){var n=t.data(this,"masonry");n?(n.option(e||{}),n._init()):t.data(this,"masonry",new t.Mason(e,this))});return this}})(window,jQuery);

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

//@codekit-prepend "vendor/jquery.requestAnimationFrame.min.js";
//@codekit-prepend "vendor/plugins/jquery.masonry.min.js";
//@codekit-prepend "vendor/plugins/jquery.easing.1.3.js";

//@codekit-prepend "vendor/plugins/!!jquery.imgCenter.minified.js";


// new PlaceholderSupport();




$(function(){

    // VARS
    var ISMOBILE = (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) ? true : false,
        CURRENTDETAILTILE = false,
        VIEWTYPE = 'read',
        HOVERTIMOUT = (ISMOBILE) ? 0 : 300,
        RESIZETIMEOUTID,
        RESIZETIMOUT = (ISMOBILE) ? 10 : 100,
        GRIDANIMATE = (ISMOBILE) ? false : true,
        $VIEWPORT = $('html, body');
        // scrollWindow = new Fx.Scroll(window);


    // HELPER FUNCTIONS
    // Calculate the smallest Tile
    var TileSize = function(containerWidth) {
        containerWidth = $('.mainGrid').width() - 60; // DEACTIVATE ??
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

        // SET MASONRY
        // $('.mainGrid > .containerLeft').masonry({
        //   isRTL: true,
        //   itemSelector: '.tile',
        //   columnWidth : TileSize,
        //   position: 'relative',
        //   isAnimated: GRIDANIMATE
        // });
        // $('.mainGrid > .containerRight').masonry({
        //   itemSelector: '.tile',
        //   columnWidth : TileSize,
        //   position: 'relative',
        //   isAnimated: GRIDANIMATE
        // });

        $(window).trigger('resize');

        // BOOKMARK BUTTON
        $('.bookmarkButton').click(function(e){
            e.preventDefault();

            var $elements = $('aside.bookmarks, .mainGrid, .mainGrid > .divider, header.main, footer.main');

            if($elements.hasClass('slideRight'))
                $elements.removeClass('slideRight');
            else
                $elements.addClass('slideRight');
        });

        // FLIP ALL TILES BUTTON
        $('a.viewButton').click(function(e) {
            e.preventDefault();
            flipTiles();
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
                    if($tile.hasClass('flip'))
                        $tile.css('z-index',9999).removeClass('flip');
                    else
                        $tile.css('z-index',9999).addClass('flip');
                },HOVERTIMOUT);
            }).mouseleave(function(){
                clearTimeout(cornerButtonTimeOut);
            });

        });
    });


    // RESIZE
    $(window).resize(function() {

        // show the size in the top bar
        $('header.main > h1').html('NEWSAPP ' + $(window).width() + 'px');


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

            // responsive TILE PADDING
            if($(window).width() <= 320) {
                $('.mainGrid .tile > div').css({
                    'top': 1,
                    'bottom': 1,
                    'left': 1,
                    'right': 1
                });
            } else {
                $('.mainGrid .tile > div').css({
                    'top': '',
                    'bottom': '',
                    'left': '',
                    'right': ''
                });
            }


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
                    $VIEWPORT.animate({scrollTop: visibleItem.offset().top - smallTile}, 900, 'easeOutElastic');
                    // scrollWindow.start(0,visibleItem.offset().top);
                }, 500);
            }

        }, RESIZETIMOUT);

    });
});
